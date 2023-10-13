import { IsByteLength, IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  @IsEmail()
  account: string;
}

export class VerifyMailDto extends SendMailDto {
  @IsNotEmpty()
  token: string;
}
