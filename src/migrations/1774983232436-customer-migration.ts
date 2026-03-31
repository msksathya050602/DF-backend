import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerMigration1774983232436 implements MigrationInterface {
    name = 'CustomerMigration1774983232436';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "handled_by" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "handled_by"`);
    }
}
