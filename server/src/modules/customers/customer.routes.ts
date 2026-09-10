import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, CustomerController.listCustomers);
router.get('/:id', authenticate, CustomerController.getCustomerById);
router.put('/:id', authenticate, CustomerController.updateCustomer);

export default router;
