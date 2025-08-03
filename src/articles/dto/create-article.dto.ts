import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ArticleStatus } from '../interface/article.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class createArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  @ApiProperty({ enum: ArticleStatus })
  status: ArticleStatus;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  categoryId: string;

  @IsOptional()
  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  tags: string[];

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image?: any;
}
