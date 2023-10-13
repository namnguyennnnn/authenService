import { SharedModule } from '@app/libs/modules/shared.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
    SharedModule.registerGRPC(
      'user_management',
      join(__dirname, '../../protos/user.proto'),
      `0.0.0.0:5282`,
      "USERS",
    ),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'nguyen071001@gmail.com',
          pass: 'xpswkcddsqpgprxa',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}


