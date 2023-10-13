import { NestFactory } from '@nestjs/core';
import { DemoModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/libs/services/shared.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

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

  const app = await NestFactory.create(DemoModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const sharedService = new SharedService();
  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGRPC(
      'users',
      join(__dirname, '../../protos/users.proto'),
      '0.0.0.0:5000',
    ),
  );
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT_USER'), () =>
    console.log(`Users's port: ${configService.get('PORT_USER')}`),
  );
  // {
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'users',
  //     // url: '0.0.0.0:5001',
  //     protoPath: join(__dirname, '../../protos/users.proto'),
  //   },
  // }
  // await app.listen(configService.get('PORT_USER'), () =>
  //   console.log(`Users's port: ${configService.get('PORT_USER')}`),
  // );

  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'users',
  //     protoPath: join(__dirname),
  //   },
  // });
  // await app.listen(3001, () => console.log("Demo's port: 3001"));
}
bootstrap();
