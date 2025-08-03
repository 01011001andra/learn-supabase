import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1754121449408 implements MigrationInterface {
    name = 'InitDatabase1754121449408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "articleTagsId" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_163145532bdee90880ff4f6dc52" FOREIGN KEY ("articleTagsId") REFERENCES "article_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_163145532bdee90880ff4f6dc52"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "articleTagsId"`);
    }

}
