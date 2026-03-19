import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Product } from "./Product";

@Entity("categories")
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  categoryName!: string;

  @Column({ type: "varchar", length: 40, unique: true })
  categoryCode!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
