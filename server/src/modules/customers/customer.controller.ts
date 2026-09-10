import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { ApiResponse } from '../../utils/apiResponse';

export class CustomerController {
  static async listCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CustomerService.listCustomers(req.query as any);
      res.json(ApiResponse.success(result.customers, 'Customers retrieved successfully', result.meta));
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const customer = await CustomerService.getCustomerById(id);
      res.json(ApiResponse.success(customer));
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const customer = await CustomerService.updateCustomer(id, req.body);
      res.json(ApiResponse.success(customer, 'Customer updated successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
