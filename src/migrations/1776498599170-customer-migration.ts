import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration name/timestamp is kept for ordering with `1776498599171-add-order-amount-paid`.
 *
 * Your database was already initialized by an older baseline (e.g. `CustomerMigration1774983232436`),
 * so recreating tables here fails with "relation already exists". The original full DDL was removed
 * from `up` — schema is assumed to exist. Fresh empty databases must be bootstrapped another way
 * (restore dump, or run legacy migrations), then run pending migrations.
 */
export class CustomerMigration1776498599170 implements MigrationInterface {
    name = 'CustomerMigration1776498599170';

    public async up(_queryRunner: QueryRunner): Promise<void> {
        // No-op: baseline tables already created by earlier migrations in this environment.
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // No-op.
    }
}
