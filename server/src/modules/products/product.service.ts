import prisma from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CloudinaryService } from '../../services/cloudinary.service';
import { AvailabilityStatus, Prisma } from '@prisma/client';

export class ProductService {
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async getPublicProducts(query: {
    search?: string;
    category?: string;
    brand?: string;
    status?: AvailabilityStatus;
    featured?: string;
    all?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Only show active unless explicitly requested by admin
    if (query.all !== 'true') {
      where.isActive = true;
    }

    if (query.featured === 'true') {
      where.isFeatured = true;
    }

    if (query.status) {
      where.availabilityStatus = query.status;
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = { slug: query.brand };
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { shortDescription: { contains: searchTerm } },
        { primarySpecification: { contains: searchTerm } },
        { category: { name: { contains: searchTerm } } },
        { brand: { name: { contains: searchTerm } } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { displayOrder: 'asc' };
    if (query.sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (query.sort === 'name_asc') orderBy = { name: 'asc' };
    else if (query.sort === 'name_desc') orderBy = { name: 'desc' };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true, logoUrl: true } },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { id: true, imageUrl: true, altText: true },
          },
          variants: {
            take: 5,
            select: { id: true, name: true, diameter: true, grade: true, size: true, finish: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        specifications: {
          orderBy: { displayOrder: 'asc' },
        },
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound(`Product with slug '${slug}' not found.`);
    }

    // Fetch up to 4 related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    return { ...product, relatedProducts };
  }

  static async createProduct(data: any) {
    const slug = data.slug || this.generateSlug(data.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw ApiError.conflict(`Product with slug '${slug}' already exists.`);
    }

    const { images, specifications, variants, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        slug,
        images: images?.length
          ? {
              create: images.map((img: any, index: number) => ({
                imageUrl: img.imageUrl,
                imagePublicId: img.imagePublicId,
                altText: img.altText || data.name,
                isPrimary: img.isPrimary ?? index === 0,
                displayOrder: img.displayOrder ?? index,
              })),
            }
          : undefined,
        specifications: specifications?.length
          ? {
              create: specifications.map((spec: any, index: number) => ({
                specKey: spec.specKey,
                specValue: spec.specValue,
                displayOrder: spec.displayOrder ?? index,
              })),
            }
          : undefined,
        variants: variants?.length
          ? {
              create: variants.map((v: any) => ({
                name: v.name,
                sku: v.sku,
                diameter: v.diameter,
                grade: v.grade,
                thickness: v.thickness,
                length: v.length,
                size: v.size,
                weight: v.weight,
                finish: v.finish,
                isAvailable: v.isAvailable ?? true,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        specifications: true,
        variants: true,
      },
    });
  }

  static async updateProduct(id: string, data: any) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Product not found.');
    }

    let slug = data.slug;
    if (data.name && !data.slug) {
      slug = this.generateSlug(data.name);
    }

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.product.findUnique({ where: { slug } });
      if (conflict) {
        throw ApiError.conflict(`Product slug '${slug}' is already taken.`);
      }
    }

    const { images, specifications, variants, ...productData } = data;

    // Run in a transaction
    return prisma.$transaction(async (tx) => {
      // 1. Update basic product info
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          slug: slug || existing.slug,
        },
      });

      // 2. Replace specifications if provided
      if (specifications) {
        await tx.productSpecification.deleteMany({ where: { productId: id } });
        if (specifications.length > 0) {
          await tx.productSpecification.createMany({
            data: specifications.map((s: any, idx: number) => ({
              productId: id,
              specKey: s.specKey,
              specValue: s.specValue,
              displayOrder: s.displayOrder ?? idx,
            })),
          });
        }
      }

      // 3. Update variants if provided
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId: id,
              name: v.name,
              sku: v.sku,
              diameter: v.diameter,
              grade: v.grade,
              thickness: v.thickness,
              length: v.length,
              size: v.size,
              weight: v.weight,
              finish: v.finish,
              isAvailable: v.isAvailable ?? true,
            })),
          });
        }
      }

      // 4. Update images if provided
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any, idx: number) => ({
              productId: id,
              imageUrl: img.imageUrl,
              imagePublicId: img.imagePublicId,
              altText: img.altText || updated.name,
              isPrimary: img.isPrimary ?? idx === 0,
              displayOrder: img.displayOrder ?? idx,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          images: true,
          specifications: true,
          variants: true,
        },
      });
    });
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw ApiError.notFound('Product not found.');
    }

    // Clean up Cloudinary images
    for (const image of product.images) {
      if (image.imagePublicId) {
        await CloudinaryService.deleteImage(image.imagePublicId);
      }
    }

    return prisma.product.delete({ where: { id } });
  }

  static async toggleFeatured(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound('Product not found.');

    return prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    });
  }
}
