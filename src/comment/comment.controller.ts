import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateUpdateCommentDto } from './dto/create-update-comment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async updateOrCreateComment(
    @Request() req,
    @Body() createOrUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    return this.commentService.updateOrCreateComment(
      req.user.id,
      createOrUpdateCommentDto,
    );
  }

  @Get('/:articleId')
  async isValidComment(
    @Request() req,
    @Param('articleId') articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    return this.commentService.isValidComment(req.user.id, articleId);
  }
}
