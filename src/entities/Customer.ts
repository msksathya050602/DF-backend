import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("customers")
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  firstName!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  lastName?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  customerPhone?: string;

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  customerEmail?: string;

  @Column({ type: "text", nullable: true })
  customerAddress?: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
