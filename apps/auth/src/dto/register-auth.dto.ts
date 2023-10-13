import { IsByteLength, IsNotEmpty } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  user_name: string;
  @IsNotEmpty()
  account: string;
  @IsNotEmpty()
  @IsByteLength(8)
  password: string;
}
