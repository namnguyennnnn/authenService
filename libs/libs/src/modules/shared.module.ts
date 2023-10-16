import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ServerCredentials,ChannelCredentials } from '@grpc/grpc-js'

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class SharedModule {
  static registerGRPC(
    pkg: string,
    protoPath: string,
    url: string,
    provide: string,
  ): DynamicModule {
    const providers = [
      {
        provide,
        useFactory: () => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              package: pkg,
              protoPath,
              url
              
            },

          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
