import { Router } from 'express';
import { EnquiryController } from './enquiry.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createPublicEnquirySchema,
  updateEnquiryStatusSchema,
  assignStaffSchema,
  enquiryQuerySchema,
} from './enquiry.schema';

const router = Router();

// Public submission
router.post('/', validate(createPublicEnquirySchema), EnquiryController.createPublicEnquiry);

// Protected Admin/Staff routes
router.get('/', authenticate, validate(enquiryQuerySchema), EnquiryController.getAdminEnquiries);
router.get('/:id', authenticate, EnquiryController.getEnquiryById);
router.put('/:id/status', authenticate, validate(updateEnquiryStatusSchema), EnquiryController.updateEnquiryStatus);
router.put('/:id/assign', authenticate, validate(assignStaffSchema), EnquiryController.assignStaff);

export default router;
