import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CloudinaryService } from '../../services/cloudinary.service';

export class CategoryService {
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async getAllCategories(includeInactive = false) {
    return prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: {
              take: 3,
            },
          },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound(`Category with slug '${slug}' was not found.`);
    }

    return category;
  }

  static async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    imagePublicId?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    const slug = data.slug || this.generateSlug(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw ApiError.conflict(`A category with slug '${slug}' already exists.`);
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      imageUrl?: string;
      imagePublicId?: string;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Category not found.');
    }

    let slug = data.slug;
    if (data.name && !data.slug) {
      slug = this.generateSlug(data.name);
    }

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.category.findUnique({ where: { slug } });
      if (slugTaken) {
        throw ApiError.conflict(`Slug '${slug}' is already in use.`);
      }
    }

    // Clean up old Cloudinary image if replaced
    if (data.imagePublicId && existing.imagePublicId && data.imagePublicId !== existing.imagePublicId) {
      await CloudinaryService.deleteImage(existing.imagePublicId);
    }

    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw ApiError.notFound('Category not found.');
    }

    if (category._count.products > 0) {
      throw ApiError.badRequest(
        `Cannot delete category '${category.name}' because it contains ${category._count.products} products. Reassign or delete products first.`
      );
    }

    if (category.imagePublicId) {
      await CloudinaryService.deleteImage(category.imagePublicId);
    }

    return prisma.category.delete({ where: { id } });
  }

  static async reorderCategories(items: { id: string; displayOrder: number }[]) {
    const updates = items.map((item) =>
      prisma.category.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    );

    await prisma.$transaction(updates);
    return { message: 'Categories reordered successfully.' };
  }
}
