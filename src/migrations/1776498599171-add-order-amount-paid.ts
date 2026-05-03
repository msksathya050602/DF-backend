import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderAmountPaid1776498599171 implements MigrationInterface {
    name = 'AddOrderAmountPaid1776498599171';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "amountPaid" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "amountPaid"`);
    }
}
