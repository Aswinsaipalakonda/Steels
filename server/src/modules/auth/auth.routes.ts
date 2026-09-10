import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { loginSchema, changePasswordSchema, createUserSchema, updateUserSchema } from './auth.schema';
import { Role } from '@prisma/client';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

// Super Admin user management
router.get('/users', authenticate, authorize(Role.SUPER_ADMIN), AuthController.listUsers);
router.post('/users', authenticate, authorize(Role.SUPER_ADMIN), validate(createUserSchema), AuthController.createUser);
router.put('/users/:id', authenticate, authorize(Role.SUPER_ADMIN), validate(updateUserSchema), AuthController.updateUser);

export default router;
