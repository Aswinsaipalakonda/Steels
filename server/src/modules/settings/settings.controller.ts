import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { ApiResponse } from '../../utils/apiResponse';

export class SettingsController {
  static async getPublicSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getPublicSettings();
      res.json(ApiResponse.success(settings));
    } catch (error) {
      next(error);
    }
  }

  static async getAllAdminSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getAllSettings();
      res.json(ApiResponse.success(settings));
    } catch (error) {
      next(error);
    }
  }

  static async updateBulkSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { settings } = req.body;
      const updated = await SettingsService.updateBulkSettings(settings);
      res.json(ApiResponse.success(updated, 'Settings updated successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
