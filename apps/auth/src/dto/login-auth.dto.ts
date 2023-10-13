import { IsByteLength, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  account: string;
  @IsNotEmpty()
  @IsByteLength(8)
  password: string;
}
