import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}
