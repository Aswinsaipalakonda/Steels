import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { ApiResponse } from '../../utils/apiResponse';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getPublicProducts(req.query as any);
      res.json(ApiResponse.success(result.products, 'Products retrieved successfully', result.meta));
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const product = await ProductService.getProductBySlug(slug);
      res.json(ApiResponse.success(product));
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(ApiResponse.success(product, 'Product created successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await ProductService.updateProduct(id, req.body);
      res.json(ApiResponse.success(product, 'Product updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await ProductService.deleteProduct(id);
      res.json(ApiResponse.success(null, 'Product deleted successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await ProductService.toggleFeatured(id);
      res.json(ApiResponse.success(product, `Product ${product.isFeatured ? 'marked as featured' : 'unfeatured'}.`));
    } catch (error) {
      next(error);
    }
  }
}
