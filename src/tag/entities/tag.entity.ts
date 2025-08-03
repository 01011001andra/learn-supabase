import { ArticleTag } from 'src/articletag/entities/articletag.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
  articleTags: ArticleTag[];
}
