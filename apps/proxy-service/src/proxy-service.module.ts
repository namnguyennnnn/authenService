import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProxyServiceController } from './proxy-service.controller';
import { ProxyServiceService } from './proxy-service.service';
import { ReverseProxyAuthMiddleware } from '../middleware/proxy-auth.middleware';

@Module({
  imports: [],
  controllers: [ProxyServiceController],
  providers: [ProxyServiceService],
})
export class ProxyServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ReverseProxyAuthMiddleware)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });
  }
}
