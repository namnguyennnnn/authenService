import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World!';
  }
  findOne({ account }: { account: string }) {
    return { name: 'nguyen', uid: '1', avatar: '', role: '0' };
  }
}
