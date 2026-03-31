import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1772559161670 implements MigrationInterface {
    name = 'MigrationName1772559161670';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "branchName" character varying(255) NOT NULL, "branchAddress" text, "branchPhone" character varying(20), "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "branches"`);
    }
}
