import { z } from 'zod';
import { EnquiryStatus } from '@prisma/client';

export const createPublicEnquirySchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(8, 'Valid phone number is required'),
    email: z.string().email('Valid email is required').optional().or(z.literal('')),
    company: z.string().optional(),
    location: z.string().optional(),
    productId: z.string().uuid().optional().nullable(),
    variantId: z.string().uuid().optional().nullable(),
    quantity: z.coerce.number().positive('Quantity must be greater than 0').optional().nullable(),
    unit: z.string().default('MT'),
    message: z.string().optional(),
    sourcePage: z.string().optional(),
  }),
});

export const updateEnquiryStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid enquiry ID required'),
  }),
  body: z.object({
    status: z.nativeEnum(EnquiryStatus),
    note: z.string().optional(),
    assignedUserId: z.string().uuid().optional().nullable(),
    internalNotes: z.string().optional(),
  }),
});

export const assignStaffSchema = z.object({
  params: z.object({
    id: z.string().uuid('Valid enquiry ID required'),
  }),
  body: z.object({
    userId: z.string().uuid('Valid staff user ID required'),
  }),
});

export const enquiryQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.nativeEnum(EnquiryStatus).optional(),
    productId: z.string().uuid().optional(),
    assignedUserId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(15),
  }),
});
