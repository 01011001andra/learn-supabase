import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleStatus } from '../interface/article.interface';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { ArticleTag } from 'src/articletag/entities/articletag.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
  articleTags: ArticleTag[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @CreateDateColumn()
  readonly updatedAt: Date;
}
