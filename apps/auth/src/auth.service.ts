import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private mailerService: MailerService) {}

  sendUserConfirmation(email: string, token: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `<p>Click <a href="http://localhost:3000/confirmation?token=${token}">here</a> to reset your password</p>`,
    });
  }
}
