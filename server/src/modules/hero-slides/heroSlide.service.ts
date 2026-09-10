import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CloudinaryService } from '../../services/cloudinary.service';

export class HeroSlideService {
  static async getPublicSlides() {
    return prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async getAllAdminSlides() {
    return prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  static async createSlide(data: any) {
    return prisma.heroSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        bgImageUrl: data.bgImageUrl,
        bgImagePublicId: data.bgImagePublicId,
        fgImageUrl: data.fgImageUrl,
        fgImagePublicId: data.fgImagePublicId,
        primaryCtaText: data.primaryCtaText || 'Explore Products',
        primaryCtaLink: data.primaryCtaLink || '/products',
        secondaryCtaText: data.secondaryCtaText || 'Request a Quote',
        secondaryCtaLink: data.secondaryCtaLink || '/quote',
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateSlide(id: string, data: any) {
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Hero slide not found.');

    if (data.bgImagePublicId && existing.bgImagePublicId && data.bgImagePublicId !== existing.bgImagePublicId) {
      await CloudinaryService.deleteImage(existing.bgImagePublicId);
    }

    return prisma.heroSlide.update({
      where: { id },
      data,
    });
  }

  static async deleteSlide(id: string) {
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Hero slide not found.');

    if (existing.bgImagePublicId) {
      await CloudinaryService.deleteImage(existing.bgImagePublicId);
    }
    if (existing.fgImagePublicId) {
      await CloudinaryService.deleteImage(existing.fgImagePublicId);
    }

    return prisma.heroSlide.delete({ where: { id } });
  }

  static async reorderSlides(items: { id: string; displayOrder: number }[]) {
    const updates = items.map((item) =>
      prisma.heroSlide.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    );

    await prisma.$transaction(updates);
    return { message: 'Slides reordered successfully.' };
  }
}
