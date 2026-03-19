import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./Category";
import { Pricing } from "./Pricing";

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "category_id", type: "uuid" })
  categoryId!: string;

  @Column({ type: "varchar", length: 150 })
  productName!: string;

  @Column({ type: "varchar", length: 60, unique: true })
  productCode!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @OneToMany(() => Pricing, (pricing) => pricing.product)
  pricing!: Pricing[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
