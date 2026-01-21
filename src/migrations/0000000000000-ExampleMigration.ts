import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExampleMigration0000000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Example: Create a table
        // await queryRunner.query(`
        //     CREATE TABLE "examples" (
        //         "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        //         "name" varchar(255) NOT NULL,
        //         "description" text,
        //         "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        //         "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        //         CONSTRAINT "PK_examples" PRIMARY KEY ("id")
        //     )
        // `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Example: Drop the table
        // await queryRunner.query(`DROP TABLE "examples"`);
    }
}
