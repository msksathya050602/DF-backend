import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerMigration1773841715503 implements MigrationInterface {
    name = 'CustomerMigration1773841715503';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(150) NOT NULL, "lastName" character varying(150), "customerPhone" character varying(20), "customerEmail" character varying(255), "customerAddress" text, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0c402e0b777a8beeca160f23351" UNIQUE ("customerEmail"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }
}
