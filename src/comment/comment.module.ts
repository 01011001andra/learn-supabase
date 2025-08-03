import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Comment, Article])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
