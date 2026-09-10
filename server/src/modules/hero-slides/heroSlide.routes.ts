import { Router } from 'express';
import { HeroSlideController } from './heroSlide.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createHeroSlideSchema, updateHeroSlideSchema } from './heroSlide.schema';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', HeroSlideController.getPublicSlides);

// Protected Admin
router.get('/admin/all', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), HeroSlideController.getAllAdminSlides);
router.post(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createHeroSlideSchema),
  HeroSlideController.createSlide
);
router.put('/reorder', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), HeroSlideController.reorderSlides);
router.put(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(updateHeroSlideSchema),
  HeroSlideController.updateSlide
);
router.delete('/:id', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), HeroSlideController.deleteSlide);

export default router;
