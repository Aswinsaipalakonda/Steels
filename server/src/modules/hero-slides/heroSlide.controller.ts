import { Request, Response, NextFunction } from 'express';
import { HeroSlideService } from './heroSlide.service';
import { ApiResponse } from '../../utils/apiResponse';

export class HeroSlideController {
  static async getPublicSlides(_req: Request, res: Response, next: NextFunction) {
    try {
      const slides = await HeroSlideService.getPublicSlides();
      res.json(ApiResponse.success(slides));
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdminSlides(_req: Request, res: Response, next: NextFunction) {
    try {
      const slides = await HeroSlideService.getAllAdminSlides();
      res.json(ApiResponse.success(slides));
    } catch (error) {
      next(error);
    }
  }

  static async createSlide(req: Request, res: Response, next: NextFunction) {
    try {
      const slide = await HeroSlideService.createSlide(req.body);
      res.status(201).json(ApiResponse.success(slide, 'Slide created successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async updateSlide(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const slide = await HeroSlideService.updateSlide(id, req.body);
      res.json(ApiResponse.success(slide, 'Slide updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteSlide(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await HeroSlideService.deleteSlide(id);
      res.json(ApiResponse.success(null, 'Slide deleted successfully.'));
    } catch (error) {
      next(error);
    }
  }

  static async reorderSlides(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await HeroSlideService.reorderSlides(req.body.items);
      res.json(ApiResponse.success(result, result.message));
    } catch (error) {
      next(error);
    }
  }
}
