import { ForbiddenException, Injectable } from '@nestjs/common';
import { createArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ArticleQueryDto } from './dto/article-query.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { ArticleTag } from 'src/articletag/entities/articletag.entity';

@Injectable()
export class ArticleService {
  // resource
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private TagRepository: Repository<Tag>,
    @InjectRepository(ArticleTag)
    private ArticleTagRepository: Repository<ArticleTag>,
    private CloudinaryService: CloudinaryService,
  ) {}

  async articleByUser(userId: string, query: ArticleQueryDto) {
    const {
      title,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // pagination
    const skip = (page - 1) * limit;
    const qb = this.ArticleRepository.createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    // Searching
    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }

    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .where({ userId })
      .select(['article', 'category.name'])
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createArticle(
    userId: string,
    createArticleDto: createArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.CloudinaryService.uploadImageStream(file);
    }

    const newArticle = this.ArticleRepository.create({
      ...createArticleDto,
      image,
      userId,
    });

    await this.ArticleRepository.save(newArticle);

    for (const tagName of createArticleDto.tags) {
      let tag = await this.TagRepository.findOne({
        where: { name: tagName.toLowerCase() },
      });
      if (!tag) {
        tag = this.TagRepository.create({ name: tagName.toLowerCase() });
        await this.TagRepository.save(tag);
      }

      const articleTag = this.ArticleTagRepository.create({
        article: newArticle,
        tag,
      });

      await this.ArticleTagRepository.save(articleTag);
    }
    return newArticle;
  }

  async findAllArticle(query: ArticleQueryDto) {
    const {
      title,
      categoryId,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    // pagination
    const skip = (page - 1) * limit;
    const qb = this.ArticleRepository.createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    // Searching
    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }

    if (categoryId) {
      qb.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    // Relasi
    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .select(['article', 'category.name', 'user.name', 'user.email'])
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.ArticleRepository.findOne({
      relations: [
        'user',
        'category',
        'articleTags',
        'articleTags.tag',
        'comments',
        'comments.user',
      ],
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        category: {
          name: true,
        },
        user: {
          name: true,
          email: true,
          role: true,
        },
        articleTags: {
          id: true,
          tag: {
            id: true,
            name: true,
          },
        },
        comments: {
          id: true,
          content: true,
          user: {
            id: true,
            name: true,
            email: true,
          },
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  async updateArticleByParams(
    userId: string,
    article: Article,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) throw new ForbiddenException();

    if (file) {
      article.image = await this.CloudinaryService.uploadImageStream(file);
    }
    Object.assign(article, updateArticleDto);
    return await this.ArticleRepository.save(article);
  }

  async deleteArticleByParams(
    userId: string,
    articleData: Article,
  ): Promise<void> {
    const currentUser = await this.ArticleRepository.findOne({
      where: { userId },
    });

    if (!currentUser) throw new ForbiddenException();
    await this.ArticleRepository.delete(articleData.id);
  }
}
