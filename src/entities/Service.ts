import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Pricing } from "./Pricing";

@Entity("services")
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  serviceName!: string;

  @Column({ type: "varchar", length: 40, unique: true })
  serviceCode!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => Pricing, (pricing) => pricing.service)
  pricing!: Pricing[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
