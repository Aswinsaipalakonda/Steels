import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ApiError } from '../utils/apiError';
import fs from 'fs';
import path from 'path';

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
        try {
          const uploadsDir = path.join(__dirname, '../../public/uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const randomId = 'product_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
          let ext = 'jpg';
          if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
            ext = 'png';
          } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
            ext = 'webp';
          }
          const filename = `${randomId}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, buffer);

          return resolve({
            url: `/uploads/${filename}`,
            publicId: `${folder}/${filename}`,
          });
        } catch (err: any) {
          console.error('Local upload file save failed:', err);
          return resolve({
            url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
            publicId: `${folder}/fallback`,
          });
        }
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
