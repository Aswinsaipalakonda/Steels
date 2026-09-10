import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { Prisma } from '@prisma/client';

export class CustomerService {
  static async listCustomers(query: { search?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {};
    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } },
        { company: { contains: s } },
        { location: { contains: s } },
      ];
    }

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: { select: { enquiries: true } },
          enquiries: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true, status: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      customers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        enquiries: {
          orderBy: { createdAt: 'desc' },
          include: {
            product: { select: { name: true, slug: true } },
            variant: { select: { name: true } },
          },
        },
      },
    });

    if (!customer) throw ApiError.notFound('Customer record not found.');
    return customer;
  }

  static async updateCustomer(id: string, data: { name?: string; phone?: string; email?: string; company?: string; location?: string; notes?: string }) {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Customer not found.');

    return prisma.customer.update({
      where: { id },
      data,
    });
  }
}
