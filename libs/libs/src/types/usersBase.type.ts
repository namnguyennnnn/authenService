import { HttpStatus } from '@nestjs/common';

export interface UsersBase {
  isUserExist(params: { account: string }): {
    message: string;
    status: HttpStatus;
  };
}
