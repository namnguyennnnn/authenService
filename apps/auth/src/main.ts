import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const allowlist = ['http://localhost:3000'];
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions: CorsOptions;
    const origin = req.header('Origin');
    // console.log(origin);
    if (allowlist.indexOf(origin) !== -1) {
      corsOptions = { origin: true, credentials: true };
    } else {
      corsOptions = { origin: false, credentials: true };
    }
    callback(null, corsOptions);
  };
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors(corsOptionsDelegate);
  await app.listen(configService.get('PORT_AUTH'), () =>
    console.log(`Auth's port: ${configService.get('PORT_AUTH')}`),
  );
}
bootstrap();
