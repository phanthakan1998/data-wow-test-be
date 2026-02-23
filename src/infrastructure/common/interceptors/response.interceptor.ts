import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IApiResponse } from '../types/api-response.type';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: 'Operation successful',
        data,
      })),
    );
  }
}
