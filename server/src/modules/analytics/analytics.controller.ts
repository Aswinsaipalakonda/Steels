import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiResponse } from '../../utils/apiResponse';

export class AnalyticsController {
  static async getDashboardOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getDashboardOverview();
      res.json(ApiResponse.success(data));
    } catch (error) {
      next(error);
    }
  }
}
