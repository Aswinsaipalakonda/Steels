import { z } from 'zod';

export const createHeroSlideSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Headline is required'),
    subtitle: z.string().optional(),
    bgImageUrl: z.string().url('Background image URL is required'),
    bgImagePublicId: z.string().optional(),
    fgImageUrl: z.string().url().optional().nullable(),
    fgImagePublicId: z.string().optional().nullable(),
    primaryCtaText: z.string().default('Explore Products'),
    primaryCtaLink: z.string().default('/products'),
    secondaryCtaText: z.string().optional().nullable(),
    secondaryCtaLink: z.string().optional().nullable(),
    displayOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateHeroSlideSchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid slide ID required'),
  }),
  body: createHeroSlideSchema.shape.body.partial(),
});
