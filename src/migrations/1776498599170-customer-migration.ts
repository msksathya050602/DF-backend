import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerMigration1776498599170 implements MigrationInterface {
    name = 'CustomerMigration1776498599170';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "branchName" character varying(255) NOT NULL, "branchAddress" text, "branchPhone" character varying(20), "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" character varying(120) NOT NULL, "serviceCode" character varying(40) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cf5bdaeca13c97ac8a01e8cd8bf" UNIQUE ("serviceName"), CONSTRAINT "UQ_fe0e083b9943e15888dc8126681" UNIQUE ("serviceCode"), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "service_id" uuid NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying(8) NOT NULL DEFAULT 'INR', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_pricing_product_service" UNIQUE ("product_id", "service_id"), CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid NOT NULL, "productName" character varying(150) NOT NULL, "productCode" character varying(60) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3146a8c669fc3f362c02fa9e0ba" UNIQUE ("productCode"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryName" character varying(120) NOT NULL, "categoryCode" character varying(40) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f46afc39e51f518a78cbe94cb90" UNIQUE ("categoryName"), CONSTRAINT "UQ_340f63a2d408c0d5762221cad75" UNIQUE ("categoryCode"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(150) NOT NULL, "lastName" character varying(150), "customerPhone" character varying(20), "customerEmail" character varying(255), "customerAddress" text, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0c402e0b777a8beeca160f23351" UNIQUE ("customerEmail"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."order_items_itemstatus_enum" AS ENUM('RECEIVED', 'PROCESSING', 'DONE', 'DELIVERED')`);
        await queryRunner.query(
            `CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "service_id" uuid NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "lineTotal" numeric(10,2) NOT NULL, "itemStatus" "public"."order_items_itemstatus_enum" NOT NULL DEFAULT 'RECEIVED', "remarks" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('CREATED', 'DELIVERED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED')`);
        await queryRunner.query(
            `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying(40) NOT NULL, "customer_id" uuid NOT NULL, "branch_id" uuid NOT NULL, "handled_by" text, "orderStatus" "public"."orders_orderstatus_enum" NOT NULL DEFAULT 'CREATED', "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'PENDING', "subTotal" numeric(10,2) NOT NULL DEFAULT '0', "discountAmount" numeric(10,2) NOT NULL DEFAULT '0', "taxAmount" numeric(10,2) NOT NULL DEFAULT '0', "totalAmount" numeric(10,2) NOT NULL DEFAULT '0', "pickupDate" TIMESTAMP, "deliveryDate" TIMESTAMP, "notes" text, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" text NOT NULL, "roles" text NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "pricing" ADD CONSTRAINT "FK_593283e7d1406fc51668e05dd11" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pricing" ADD CONSTRAINT "FK_ceee2a0f75732e11a00899e4252" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(
            `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(
            `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "order_items" ADD CONSTRAINT "FK_4b7bcdfcab38cf99bc8ded5c48a" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_17b723da2c12837f4bc21e33398" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_17b723da2c12837f4bc21e33398"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_4b7bcdfcab38cf99bc8ded5c48a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "pricing" DROP CONSTRAINT "FK_ceee2a0f75732e11a00899e4252"`);
        await queryRunner.query(`ALTER TABLE "pricing" DROP CONSTRAINT "FK_593283e7d1406fc51668e05dd11"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TYPE "public"."order_items_itemstatus_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "pricing"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "branches"`);
    }
}
