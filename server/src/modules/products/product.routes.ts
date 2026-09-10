import { Router } from 'express';
import { ProductController } from './product.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { productQuerySchema, createProductSchema, updateProductSchema } from './product.schema';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', validate(productQuerySchema), ProductController.getProducts);
router.get('/:slug', ProductController.getProductBySlug);

// Protected Admin
router.post(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(createProductSchema),
  ProductController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validate(updateProductSchema),
  ProductController.updateProduct
);

router.patch(
  '/:id/feature',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  ProductController.toggleFeatured
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  ProductController.deleteProduct
);

export default router;
