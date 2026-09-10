import { z } from 'zod';
import { AvailabilityStatus } from '@prisma/client';

export const productQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    status: z.nativeEnum(AvailabilityStatus).optional(),
    featured: z.enum(['true', 'false']).optional(),
    all: z.enum(['true', 'false']).optional(), // Include inactive for admin
    sort: z.enum(['newest', 'order', 'name_asc', 'name_desc']).default('order'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    slug: z.string().optional(),
    categoryId: z.string().uuid('Valid category ID required'),
    brandId: z.string().uuid().optional().nullable(),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    primarySpecification: z.string().optional(),
    availableUnits: z.string().default('MT,KG,PCS,Bundles'),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    displayOrder: z.coerce.number().int().default(0),
    availabilityStatus: z.nativeEnum(AvailabilityStatus).default(AvailabilityStatus.AVAILABLE),
    images: z
      .array(
        z.object({
          imageUrl: z.string().url(),
          imagePublicId: z.string().optional(),
          altText: z.string().optional(),
          isPrimary: z.boolean().default(false),
          displayOrder: z.number().int().default(0),
        })
      )
      .optional(),
    specifications: z
      .array(
        z.object({
          specKey: z.string().min(1),
          specValue: z.string().min(1),
          displayOrder: z.number().int().default(0),
        })
      )
      .optional(),
    variants: z
      .array(
        z.object({
          name: z.string().min(1),
          sku: z.string().optional(),
          diameter: z.string().optional(),
          grade: z.string().optional(),
          thickness: z.string().optional(),
          length: z.string().optional(),
          size: z.string().optional(),
          weight: z.string().optional(),
          finish: z.string().optional(),
          isAvailable: z.boolean().default(true),
        })
      )
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid Product ID required'),
  }),
  body: createProductSchema.shape.body.partial(),
});
