import { Controller, Get } from '@nestjs/common';
import { ProxyServiceService } from './proxy-service.service';

@Controller()
export class ProxyServiceController {
  constructor(private readonly proxyServiceService: ProxyServiceService) {}

  @Get()
  getHello(): string {
    return this.proxyServiceService.getHello();
  }
}
