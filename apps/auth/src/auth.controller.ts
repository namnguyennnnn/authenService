import { ErrorsInterceptor } from '@app/libs/interceptors/JWTException';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { Inject, Param, Query, Req, Res } from '@nestjs/common/decorators';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { SetCookiesInterceptor } from '../interceptors/SetCookies';
import { Hashing } from './Utils/Hashing';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersDto } from './dto/users.dto';
import { CookiesReturnType } from './types/cookies.type';
import { MailService } from './types/mail.type';
import { UsersService } from './types/users.type';
import { SendMailDto, VerifyMailDto } from './types/verify-mail.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController implements OnModuleInit {
  // private mailService: MailService;
  private usersService: UsersService;
  constructor(
    private authService: AuthService,
    @Inject('USERS') private usersClient: ClientGrpc,
    @Inject('MAIL_SERVICE') private mailClient: ClientGrpc,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.usersService =
      this.usersClient.getService<UsersService>('UserManager');
  }

  async GenerateTokens(payload: { uid: string }) {
    const access_token = this.jwtService.signAsync(payload, {
      expiresIn: '2h',
      secret: process.env.JWT_SECRET,
    });

    const refresh_token = this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    const tokens = await Promise.all([access_token, refresh_token]);
    return {
      access_token: tokens[0],
      refresh_token: tokens[1],
    };
  }

  verifyToken(token: string, secret: string = process.env.JWT_SECRET) {
    if (!token) {
      throw new UnauthorizedException();
    }

    return this.jwtService.verifyAsync(token, { secret });
  }

  @UseInterceptors(ErrorsInterceptor)
  @UseInterceptors(SetCookiesInterceptor)
  @Post('/login')
  async login(
    @Body() { account, password }: LoginAuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CookiesReturnType> {
    const users = await lastValueFrom(
      await this.usersService.GetUserByEmail({ account }),
    );
    // const users: (UsersDto & { password: string })[] = [
    //   {
    //     account: 'nguyen@gmail.com',
    //     avatar: 'avar',
    //     date_of_birth: 'date',
    //     background: 'bg',
    //     is_verified: true,
    //     join_at: 'join',
    //     uid: 'UID',
    //     user_name: 'Nguyen',
    //     password: await Hashing.hash('12345678'),
    //   },
    // ];
    if (!users.account) {
      throw new NotFoundException(undefined, 'user not found');
    }
    // const user = users[0];

    const isMatch = await Hashing.compare(password, users.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { uid: users.uid };
    const tokens = await this.GenerateTokens(payload);
    return {
      access_token: {
        expire: 7200000,
        value: tokens.access_token,
      },
      refresh_token: {
        expire: 7200000,
        value: tokens.refresh_token,
      },
    };
  }

  @UseInterceptors(ErrorsInterceptor)
  @Get('/authentication')
  authentication(@Req() req: Request) {
    const access_token = req.cookies.access_token;
    console.log('accesstoken', req.cookies);
    return this.verifyToken(access_token);
  }

  @UseInterceptors(ErrorsInterceptor)
  @UseInterceptors(SetCookiesInterceptor)
  @Get('/refreshToken')
  async refreshToken(@Req() req: Request): Promise<CookiesReturnType> {
    const token = req.cookies.refresh_token;
    console.log('refresh token::', token);
    await this.verifyToken(token);
    const tokens = await this.GenerateTokens({ uid: 'nguyen' });
    return {
      access_token: {
        expire: 7200000,
        value: tokens.access_token,
      },
      refresh_token: {
        expire: 7200000,
        value: tokens.refresh_token,
      },
    };
  }

  @UseInterceptors(ErrorsInterceptor)
  @Get('/isLogged')
  async isLogged(@Req() req: Request) {
    const access_token = req.cookies.access_token;
    return this.verifyToken(access_token);
  }

  @Get('userEmail/:account')
  async userEmailIsNotExist(@Param('account') account: string) {
    const users = [];
    if (users.length >= 1) {
      throw new BadRequestException(undefined, 'Email is exist');
    }

    // return this.usersService.isUserExist({ account });
    return {};
  }

  @Post('/registration')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const account = '';
    const message = '';
    const status = 1;

    if (!account) {
      const res = this.sendMail({
        account: registerAuthDto.account,
      });

      this.usersService.AddUser({
        account: registerAuthDto.account,
        avatar: 'a',
        is_verified: false,
        password: await Hashing.hash(registerAuthDto.password),
        user_name: registerAuthDto.user_name,
      });
      return;
    }
    throw new HttpException(message, status);
  }

  @UseInterceptors(SetCookiesInterceptor)
  @Get('/logout')
  logout() {
    return {
      access_token: {
        expire: 0,
        value: 'none',
      },
      refresh_token: {
        expire: 0,
        value: 'none',
      },
    };
  }

  @Get('confirmation')
  async userConfirmation(@Query('token') token: string) {
    try {
      const info = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(info);
      await this.usersService.VerifyAccountRequest(info.account);
      return { statusCode: HttpStatus.OK };
    } catch (e) {
      throw new HttpException('TokenExpiredError', HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ErrorsInterceptor)
  @Get()
  async VerifyAdminRoute(@Req() req: Request) {
    const access_token = req.cookies.access_token;
    console.log('verify admin route', req.cookies);
    await this.verifyToken(access_token);
    const users = this.jwtService.decode(access_token);
  }

  sendMailFC({ account }: { account: string }) {
    const token = this.jwtService.sign(
      {
        account,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );
    this.authService.sendUserConfirmation(account, token);
  }

  sendMail({ account }: SendMailDto) {
    console.log('send mail to:::', account);
    this.sendMailFC({ account });
    return { message: 'ok' };
  }

  @Get('/:account')
  async resendingMail(@Param('account') account: string) {
    console.log('resend mail to:::', account);
    this.sendMailFC({ account });
    return { message: 'ok' };
  }

  @UseInterceptors(ErrorsInterceptor)
  @Post('/verifyMail')
  async verifyMail(@Body() { account, token }: VerifyMailDto) {
    // await this.jwtService.verifyAsync(token, {
    //   secret: process.env.JWT_SECRET,
    // });
    // console.log("change isActived account ")
  }
}
