import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ArticleStatus } from '../interface/article.interface';
export class createArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
