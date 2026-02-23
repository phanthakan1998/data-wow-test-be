export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IErrorResponse {
  success: false;
  message: string | string[];
  error: string;
  statusCode: number;
  timestamp: string;
}
