import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
