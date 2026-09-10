import { Router } from 'express';
import { BrandController } from './brand.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createBrandSchema, updateBrandSchema } from './brand.schema';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', BrandController.getAll);

// Protected
router.post(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createBrandSchema),
  BrandController.create
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(updateBrandSchema),
  BrandController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  BrandController.delete
);

export default router;
