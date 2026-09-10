import { Request, Response, NextFunction } from 'express';
import { BrandService } from './brand.service';
import { ApiResponse } from '../../utils/apiResponse';

export class BrandController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.all === 'true';
      const brands = await BrandService.getAllBrands(includeInactive);
      res.json(ApiResponse.success(brands));
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await BrandService.createBrand(req.body);
      res.status(201).json(ApiResponse.success(brand, 'Brand created successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const brand = await BrandService.updateBrand(id, req.body);
      res.json(ApiResponse.success(brand, 'Brand updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await BrandService.deleteBrand(id);
      res.json(ApiResponse.success(null, 'Brand deleted successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
