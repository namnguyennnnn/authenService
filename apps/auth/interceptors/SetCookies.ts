import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookiesReturnType } from '../src/types/cookies.type';
import { Response } from 'express';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data: CookiesReturnType) => {
        const { access_token, refresh_token } = data;
        const response = context.switchToHttp().getResponse() as Response;

        response.cookie('access_token', access_token.value, {
          maxAge: access_token.expire,
          path: '/',
          httpOnly: true,
        });
        response.cookie('refresh_token', refresh_token.value, {
          maxAge: refresh_token.expire,
          path: '/',
          httpOnly: true,
        });
      }),
    );
  }
}
