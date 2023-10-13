import { NestFactory } from '@nestjs/core';
import { ProxyServiceModule } from './proxy-service.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(ProxyServiceModule);
  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });
  // app.use(
  //   '/auth',
  //   createProxyMiddleware({
  //     target: 'http://localhost:3000/',
  //     changeOrigin: true,
  //   }),
  // );
  await app.listen(3005, () => console.log('Proxy at: 3005'));
}
bootstrap();
