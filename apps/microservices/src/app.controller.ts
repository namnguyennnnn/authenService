import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  test() {
    return 'test';
  }

  @MessagePattern({ cmd: 'hello' })
  getHello(@Ctx() context: RmqContext) {
    console.log(context);
    return this.appService.getHello();
  }
}
