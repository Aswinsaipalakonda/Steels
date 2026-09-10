import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from './enquiry.service';
import { ApiResponse } from '../../utils/apiResponse';

export class EnquiryController {
  static async createPublicEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiry = await EnquiryService.createPublicEnquiry(req.body);
      res.status(201).json(
        ApiResponse.success(
          {
            enquiryNumber: enquiry.enquiryNumber,
            id: enquiry.id,
            productName: enquiry.product?.name,
          },
          'Your quotation enquiry has been registered successfully. Our sales desk will contact you shortly.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAdminEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EnquiryService.getAdminEnquiries(req.query as any);
      res.json(ApiResponse.success(result.enquiries, 'Enquiries retrieved successfully', result.meta));
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const enquiry = await EnquiryService.getEnquiryById(id);
      res.json(ApiResponse.success(enquiry));
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = await EnquiryService.updateEnquiryStatus(id, req.body, req.user?.id);
      res.json(ApiResponse.success(updated, 'Enquiry status updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async assignStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { userId } = req.body;
      const updated = await EnquiryService.assignStaff(id, userId, req.user?.id);
      res.json(ApiResponse.success(updated, 'Staff assigned successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = await EnquiryService.updateEnquiry(id, req.body, req.user?.id);
      res.json(ApiResponse.success(updated, 'Enquiry updated successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
