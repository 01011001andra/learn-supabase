import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
