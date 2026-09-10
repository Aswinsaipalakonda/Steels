import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { ApiResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { authenticate } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../../middleware/validate';

const router = Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  }),
});

// Public contact form submission
router.post('/', validate(contactSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submission = await prisma.contactSubmission.create({
      data: req.body,
    });
    res.status(201).json(ApiResponse.success(submission, 'Your message has been received. Thank you.'));
  } catch (error) {
    next(error);
  }
});

// Protected admin: List contact submissions
router.get('/', authenticate, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(ApiResponse.success(submissions));
  } catch (error) {
    next(error);
  }
});

// Protected admin: Mark as read
router.patch('/:id/read', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(ApiResponse.success(updated, 'Marked as read.'));
  } catch (error) {
    next(error);
  }
});

export default router;
