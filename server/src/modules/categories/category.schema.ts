import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    imagePublicId: z.string().optional(),
    displayOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid Category ID required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    imagePublicId: z.string().optional(),
    displayOrder: z.coerce.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const reorderCategoriesSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid(),
        displayOrder: z.number().int(),
      })
    ),
  }),
});
