import { IsNotEmpty } from 'class-validator';

export class UsersDto {
  @IsNotEmpty()
  uid: string;
  @IsNotEmpty()
  join_at: string | Date;
  @IsNotEmpty()
  user_name: string;
  @IsNotEmpty()
  date_of_birth: string | Date;
  @IsNotEmpty()
  account: string;
  @IsNotEmpty()
  avatar: string;
  @IsNotEmpty()
  background: string;
  @IsNotEmpty()
  is_verified: boolean;
}
