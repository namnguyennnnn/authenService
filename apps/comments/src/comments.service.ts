import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  getAll(id: string): string {
    return 'Hello World!';
  }
}
