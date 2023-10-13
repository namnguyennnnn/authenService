import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/users')
export class DemoController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  @GrpcMethod('UsersService', 'isUserExist')
  isUserExist(data: { account: string }) {
    console.log('Checking account user:::', data.account);
    return {
      account: '',
      message: 'The account user is exists',
      status: 200,
    };
  }

  @GrpcMethod('UsersService', 'getPersonalInfoUser')
  getPersonalInfoUserGRPC(data: { account: string }) {
    const users = this.usersService.findOne({ account: 'a' });

    return users;
  }

  @Get('/personalInfoUser')
  getPersonalInfoUser(@Req() req: Request) {
    const token = req.cookies.access_token;
    const data = this.jwtService.decode(token);
    const users = this.usersService.findOne({ account: 'a' });

    return users;
  }
}
