import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ApiError } from '../utils/apiError';

export class CloudinaryService {
  static async uploadImage(
    buffer: Buffer,
    folder: string,
    options: { width?: number; height?: number; crop?: string } = {}
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      // Check if real Cloudinary keys are provided
      const isMock =
        !process.env.CLOUDINARY_API_KEY ||
        process.env.CLOUDINARY_API_KEY === '123456789012345' ||
        process.env.CLOUDINARY_CLOUD_NAME === 'steel_demo';

      if (isMock) {
        // Fallback for local development when credentials are not yet configured
        const randomId = 'local_' + Math.random().toString(36).substring(2, 9);
        return resolve({
          url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
          publicId: `${folder}/${randomId}`,
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `steel_platform/${folder}`,
          resource_type: 'image',
          format: 'webp',
          quality: 'auto',
          fetch_format: 'auto',
          ...options,
        },
        (error: any, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(ApiError.internal(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  static async deleteImage(publicId: string): Promise<void> {
    if (!publicId || publicId.startsWith('local_')) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      console.warn(`Failed to delete Cloudinary asset ${publicId}:`, error.message);
    }
  }
}
