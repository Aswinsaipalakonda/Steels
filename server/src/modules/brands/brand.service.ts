import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CloudinaryService } from '../../services/cloudinary.service';

export class BrandService {
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async getAllBrands(includeInactive = false) {
    return prisma.brand.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  static async createBrand(data: {
    name: string;
    slug?: string;
    logoUrl?: string;
    logoPublicId?: string;
    description?: string;
    isActive?: boolean;
  }) {
    const slug = data.slug || this.generateSlug(data.name);
    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      throw ApiError.conflict(`Brand with slug '${slug}' already exists.`);
    }

    return prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logoUrl: data.logoUrl,
        logoPublicId: data.logoPublicId,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateBrand(
    id: string,
    data: {
      name?: string;
      slug?: string;
      logoUrl?: string;
      logoPublicId?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Brand not found.');
    }

    let slug = data.slug;
    if (data.name && !data.slug) {
      slug = this.generateSlug(data.name);
    }

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.brand.findUnique({ where: { slug } });
      if (conflict) {
        throw ApiError.conflict(`Brand slug '${slug}' is already in use.`);
      }
    }

    if (data.logoPublicId && existing.logoPublicId && data.logoPublicId !== existing.logoPublicId) {
      await CloudinaryService.deleteImage(existing.logoPublicId);
    }

    return prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        logoUrl: data.logoUrl,
        logoPublicId: data.logoPublicId,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }

  static async deleteBrand(id: string) {
    const existing = await prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      throw ApiError.notFound('Brand not found.');
    }

    if (existing._count.products > 0) {
      throw ApiError.badRequest(`Cannot delete brand '${existing.name}' because products are associated with it.`);
    }

    if (existing.logoPublicId) {
      await CloudinaryService.deleteImage(existing.logoPublicId);
    }

    return prisma.brand.delete({ where: { id } });
  }
}
