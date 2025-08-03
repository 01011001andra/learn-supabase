import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1754134630206 implements MigrationInterface {
  name = 'InitDatabase1754134630206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_163145532bdee90880ff4f6dc52"`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "articleId" uuid NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN "articleTagsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c20404221e5c125a581a0d90c0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(`ALTER TABLE "article" ADD "articleTagsId" uuid`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_163145532bdee90880ff4f6dc52" FOREIGN KEY ("articleTagsId") REFERENCES "article_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
