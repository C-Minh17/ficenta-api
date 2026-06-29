import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Retrieve custom message set by @ResponseMessage decorator if present
    const responseMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        let message = responseMessage;
        let responseData = data;

        // If the return object itself has a message and data structure, extract them
        if (data && typeof data === 'object') {
          if ('message' in data && 'data' in data) {
            message = data.message;
            responseData = data.data;
          } else if ('message' in data && Object.keys(data).length === 1) {
            // If the handler only returned an object with a message (e.g. { message: '...' })
            message = data.message;
            responseData = null;
          }
        }

        // Fallback default message if none is provided
        if (!message) {
          const request = context.switchToHttp().getRequest();
          const method = request.method;
          switch (method) {
            case 'GET':
              message = 'Get data successfully';
              break;
            case 'POST':
              message = 'Create data successfully';
              break;
            case 'PUT':
            case 'PATCH':
              message = 'Update data successfully';
              break;
            case 'DELETE':
              message = 'Delete data successfully';
              break;
            default:
              message = 'Execute successfully';
          }
        }

        return {
          success: true,
          message,
          data: responseData ?? null,
        };
      }),
    );
  }
}
