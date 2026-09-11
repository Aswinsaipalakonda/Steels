import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { EnquiryStatus, Prisma } from '@prisma/client';

export class EnquiryService {
  private static async generateEnquiryNumber(): Promise<string> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `ENQ-${yyyy}${mm}${dd}`;

    const countToday = await prisma.enquiry.count({
      where: {
        enquiryNumber: { startsWith: datePrefix },
      },
    });

    const sequence = String(countToday + 1).padStart(4, '0');
    return `${datePrefix}-${sequence}`;
  }

  static async createPublicEnquiry(data: {
    customerName: string;
    phone: string;
    email?: string;
    company?: string;
    location?: string;
    productId?: string | null;
    variantId?: string | null;
    quantity?: number | null;
    unit?: string;
    message?: string;
    sourcePage?: string;
  }) {
    const enquiryNumber = await this.generateEnquiryNumber();
    const effectiveEmail = data.email && data.email.trim()
      ? data.email.trim().toLowerCase()
      : `${data.phone.replace(/[^0-9]/g, '') || 'client'}@customer.steelplatform.com`;

    return prisma.$transaction(async (tx) => {
      // 1. Find or create Customer
      let customer = await tx.customer.findFirst({
        where: {
          OR: [{ phone: data.phone }, { email: effectiveEmail }],
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: data.customerName,
            email: effectiveEmail,
            phone: data.phone,
            company: data.company,
            location: data.location,
          },
        });
      } else {
        // Update company/location if provided
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: data.customerName || customer.name,
            company: data.company || customer.company,
            location: data.location || customer.location,
          },
        });
      }

      // 2. Create Enquiry
      const enquiry = await tx.enquiry.create({
        data: {
          enquiryNumber,
          customerId: customer.id,
          productId: data.productId,
          variantId: data.variantId,
          quantity: data.quantity,
          unit: data.unit || 'MT',
          location: data.location,
          message: data.message,
          sourcePage: data.sourcePage,
          status: EnquiryStatus.NEW,
        },
        include: {
          product: { select: { id: true, name: true, slug: true } },
          variant: { select: { id: true, name: true, diameter: true, grade: true } },
          customer: true,
        },
      });

      // 3. Record first status history entry
      await tx.enquiryStatusHistory.create({
        data: {
          enquiryId: enquiry.id,
          previousStatus: EnquiryStatus.NEW,
          newStatus: EnquiryStatus.NEW,
          note: 'Enquiry submitted online by customer.',
        },
      });

      return enquiry;
    });
  }

  static async getAdminEnquiries(query: {
    search?: string;
    status?: EnquiryStatus;
    productId?: string;
    assignedUserId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Prisma.EnquiryWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.assignedUserId) {
      where.assignedUserId = query.assignedUserId;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { enquiryNumber: { contains: s } },
        { customer: { name: { contains: s } } },
        { customer: { phone: { contains: s } } },
        { customer: { email: { contains: s } } },
        { customer: { company: { contains: s } } },
        { product: { name: { contains: s } } },
      ];
    }

    const [enquiries, total] = await prisma.$transaction([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, phone: true, email: true, company: true } },
          product: { select: { id: true, name: true, slug: true } },
          variant: { select: { id: true, name: true, diameter: true, grade: true, size: true } },
          assignedStaff: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return {
      enquiries,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getEnquiryById(id: string) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            enquiries: {
              where: { id: { not: id } },
              take: 5,
              select: { id: true, enquiryNumber: true, status: true, createdAt: true, quantity: true, unit: true },
            },
          },
        },
        product: {
          include: {
            category: { select: { name: true, slug: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        variant: true,
        assignedStaff: { select: { id: true, name: true, email: true } },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedBy: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!enquiry) {
      throw ApiError.notFound('Enquiry not found.');
    }

    return enquiry;
  }

  static async updateEnquiryStatus(
    id: string,
    data: {
      status: EnquiryStatus;
      note?: string;
      assignedUserId?: string | null;
      internalNotes?: string;
    },
    changedById?: string
  ) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) throw ApiError.notFound('Enquiry not found.');

    const previousStatus = enquiry.status;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.enquiry.update({
        where: { id },
        data: {
          status: data.status,
          assignedUserId: data.assignedUserId !== undefined ? data.assignedUserId : enquiry.assignedUserId,
          internalNotes: data.internalNotes !== undefined ? data.internalNotes : enquiry.internalNotes,
        },
        include: {
          customer: true,
          product: true,
          variant: true,
          assignedStaff: { select: { id: true, name: true } },
        },
      });

      // Record status transition in timeline
      await tx.enquiryStatusHistory.create({
        data: {
          enquiryId: id,
          previousStatus,
          newStatus: data.status,
          changedById,
          note: data.note || `Status changed from ${previousStatus} to ${data.status}`,
        },
      });

      return updated;
    });
  }

  static async assignStaff(enquiryId: string, staffUserId: string, assignedById?: string) {
    const staff = await prisma.user.findUnique({ where: { id: staffUserId } });
    if (!staff) throw ApiError.notFound('Staff user not found.');

    const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!enquiry) throw ApiError.notFound('Enquiry not found.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.enquiry.update({
        where: { id: enquiryId },
        data: { assignedUserId: staffUserId },
        include: { assignedStaff: { select: { id: true, name: true } } },
      });

      await tx.enquiryStatusHistory.create({
        data: {
          enquiryId,
          previousStatus: enquiry.status,
          newStatus: enquiry.status,
          changedById: assignedById,
          note: `Enquiry assigned to ${staff.name}.`,
        },
      });

      return updated;
    });
  }

  static async updateEnquiry(
    id: string,
    data: {
      quantity?: number | null;
      unit?: string | null;
      location?: string | null;
      message?: string | null;
      internalNotes?: string | null;
      status?: EnquiryStatus;
      statusNote?: string;
      customer?: {
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
        location?: string;
      };
    },
    userId?: string
  ) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id }, include: { customer: true } });
    if (!enquiry) throw ApiError.notFound('Enquiry not found.');

    return prisma.$transaction(async (tx) => {
      // 1. Update Customer details if provided
      if (data.customer && enquiry.customerId) {
        await tx.customer.update({
          where: { id: enquiry.customerId },
          data: {
            name: data.customer.name !== undefined ? data.customer.name : undefined,
            email: data.customer.email !== undefined ? data.customer.email : undefined,
            phone: data.customer.phone !== undefined ? data.customer.phone : undefined,
            company: data.customer.company !== undefined ? data.customer.company : undefined,
            location: data.customer.location !== undefined ? data.customer.location : undefined,
          },
        });
      }

      // 2. Track status change if status is updated
      if (data.status && data.status !== enquiry.status) {
        await tx.enquiryStatusHistory.create({
          data: {
            enquiryId: id,
            previousStatus: enquiry.status,
            newStatus: data.status,
            changedById: userId,
            note: data.statusNote || `Status updated to ${data.status.replace(/_/g, ' ')}`,
          },
        });
      }

      // 3. Update Enquiry
      const updated = await tx.enquiry.update({
        where: { id },
        data: {
          quantity: data.quantity !== undefined ? data.quantity : undefined,
          unit: data.unit !== undefined ? data.unit : undefined,
          location: data.location !== undefined ? data.location : undefined,
          message: data.message !== undefined ? data.message : undefined,
          internalNotes: data.internalNotes !== undefined ? data.internalNotes : undefined,
          status: data.status !== undefined ? data.status : undefined,
        },
        include: {
          customer: true,
          product: true,
          variant: true,
          statusHistory: { orderBy: { createdAt: 'desc' }, include: { changedBy: true } },
        },
      });

      return updated;
    });
  }
}

