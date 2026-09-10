import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../../middleware/upload.middleware';
import { CloudinaryService } from '../../services/cloudinary.service';
import { authenticate } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';

const router = Router();

router.post(
  '/upload',
  authenticate,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Please upload an image file.');
      }

      const folder = (req.body.folder as string) || 'general';
      const result = await CloudinaryService.uploadImage(req.file.buffer, folder);

      res.status(201).json(ApiResponse.success(result, 'Image uploaded successfully.'));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
