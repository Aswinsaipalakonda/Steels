import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/public', SettingsController.getPublicSettings);

// Protected Admin
router.get('/admin', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), SettingsController.getAllAdminSettings);
router.put('/bulk', authenticate, authorize(Role.SUPER_ADMIN, Role.ADMIN), SettingsController.updateBulkSettings);

export default router;
