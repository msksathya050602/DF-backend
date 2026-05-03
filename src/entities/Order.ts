import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { OrderItem } from '@/entities/OrderItem';

import { Branch } from './Branch';
import { Customer } from './Customer';

export enum OrderStatus {
    CREATED = 'CREATED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PARTIAL = 'PARTIAL',
    REFUNDED = 'REFUNDED',
}

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 40, unique: true })
    orderNumber!: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'handled_by', type: 'text', nullable: true })
    handledBy?: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
    orderStatus!: OrderStatus;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus!: PaymentStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subTotal!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discountAmount!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    taxAmount!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount!: number;

    /** Amount collected toward the order; required semantically when `paymentStatus` is PARTIAL; equals total when PAID. */
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    amountPaid?: number | null;

    @Column({ type: 'timestamp', nullable: true })
    pickupDate?: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveryDate?: Date;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @ManyToOne(() => Branch, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'branch_id' })
    branch!: Branch;

    @OneToMany(() => OrderItem, item => item.order)
    items!: OrderItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
