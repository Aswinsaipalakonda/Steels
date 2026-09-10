import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { ApiResponse } from '../../utils/apiResponse';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.all === 'true';
      const categories = await CategoryService.getAllCategories(includeInactive);
      res.json(ApiResponse.success(categories));
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const category = await CategoryService.getCategoryBySlug(slug);
      res.json(ApiResponse.success(category));
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(ApiResponse.success(category, 'Category created successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const category = await CategoryService.updateCategory(id, req.body);
      res.json(ApiResponse.success(category, 'Category updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await CategoryService.deleteCategory(id);
      res.json(ApiResponse.success(null, 'Category deleted successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.reorderCategories(req.body.items);
      res.json(ApiResponse.success(result, result.message));
    } catch (error) {
      next(error);
    }
  }
}
