export interface ApiResponseOptions<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export class ApiResponse {
  static success<T>(data?: T, message = 'Success', meta?: ApiResponseOptions<T>['meta']): ApiResponseOptions<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message = 'An error occurred', errors?: any): ApiResponseOptions<null> {
    return {
      success: false,
      message,
      errors,
    };
  }
}
