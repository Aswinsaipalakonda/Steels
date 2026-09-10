import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Brand name must be at least 2 characters'),
    slug: z.string().optional(),
    logoUrl: z.string().url().optional(),
    logoPublicId: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid Brand ID required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().optional(),
    logoUrl: z.string().url().optional(),
    logoPublicId: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
