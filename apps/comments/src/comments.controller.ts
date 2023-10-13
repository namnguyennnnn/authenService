import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('parent/:id')
  getAll(@Param('id') id: string): string {
    return this.commentsService.getHello();
  }
}
