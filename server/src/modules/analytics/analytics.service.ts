import prisma from '../../config/db';
import { EnquiryStatus } from '@prisma/client';

export class AnalyticsService {
  static async getDashboardOverview() {
    const [
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      quotationSentEnquiries,
      confirmedEnquiries,
      completedEnquiries,
      totalProducts,
      activeProducts,
      totalCategories,
      totalCustomers,
    ] = await prisma.$transaction([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: EnquiryStatus.NEW } }),
      prisma.enquiry.count({ where: { status: EnquiryStatus.CONTACTED } }),
      prisma.enquiry.count({ where: { status: EnquiryStatus.QUOTATION_SENT } }),
      prisma.enquiry.count({ where: { status: EnquiryStatus.CONFIRMED } }),
      prisma.enquiry.count({ where: { status: EnquiryStatus.COMPLETED } }),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.customer.count(),
    ]);

    // Conversion rate: (Confirmed + Completed) / totalEnquiries * 100
    const convertedCount = confirmedEnquiries + completedEnquiries;
    const conversionRate = totalEnquiries > 0 ? ((convertedCount / totalEnquiries) * 100).toFixed(1) : '0';

    // Status breakdown for donut charts
    const statusCounts = await prisma.enquiry.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const statusBreakdown = statusCounts.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // Recent 6 enquiries
    const recentEnquiries = await prisma.enquiry.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, phone: true, company: true } },
        product: { select: { name: true } },
        assignedStaff: { select: { name: true } },
      },
    });

    // Top enquired products
    const productEnquiries = await prisma.enquiry.groupBy({
      by: ['productId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      productEnquiries
        .filter((item) => item.productId !== null)
        .map(async (item) => {
          const prod = await prisma.product.findUnique({
            where: { id: item.productId! },
            select: { id: true, name: true, slug: true },
          });
          return {
            product: prod,
            count: item._count.id,
          };
        })
    );

    return {
      overview: {
        totalEnquiries,
        newEnquiries,
        contactedEnquiries,
        quotationSentEnquiries,
        confirmedEnquiries,
        completedEnquiries,
        totalProducts,
        activeProducts,
        totalCategories,
        totalCustomers,
        conversionRate: `${conversionRate}%`,
      },
      statusBreakdown,
      topProducts: topProductsWithDetails,
      recentEnquiries,
    };
  }
}
