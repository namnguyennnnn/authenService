import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
  getGRPC(pkg: string, protoPath: string, url: string): MicroserviceOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: pkg,
        url,
        protoPath,
      },
    };
  }
}
