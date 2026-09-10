import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema, reorderCategoriesSchema } from './category.schema';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', CategoryController.getAll);
router.get('/:slug', CategoryController.getBySlug);

// Protected Admin routes
router.post(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createCategorySchema),
  CategoryController.create
);

router.put(
  '/reorder',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(reorderCategoriesSchema),
  CategoryController.reorder
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(updateCategorySchema),
  CategoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  CategoryController.delete
);

export default router;
