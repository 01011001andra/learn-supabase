import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Repository } from 'typeorm';
import { CreateUpdateCommentDto } from './dto/create-update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private CommentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
  ) {}

  async updateOrCreateComment(
    userId: string,
    createUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    const article = await this.ArticleRepository.findOne({
      where: { id: createUpdateCommentDto.articleId },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const comment = await this.CommentRepository.findOne({
      where: { articleId: createUpdateCommentDto.articleId, userId },
    });

    if (!comment) {
      const newComment = this.CommentRepository.create({
        ...createUpdateCommentDto,
        userId,
        articleId: createUpdateCommentDto.articleId,
      });
      await this.CommentRepository.save(newComment);
      return { message: 'Comment created!' };
    } else {
      Object.assign(comment, createUpdateCommentDto);
      await this.CommentRepository.save(comment);
      return { message: 'Comment updated!' };
    }
  }

  async isValidComment(
    userId: string,
    articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    const comment = await this.CommentRepository.findOne({
      where: { articleId, userId },
    });
    if (comment) {
      return { id: comment.id, status: true };
    } else {
      return { status: false };
    }
  }
}
