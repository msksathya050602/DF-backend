import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Order } from './Order';
import { Product } from './Product';
import { Service } from './Service';

export enum OrderItemStatus {
    RECEIVED = 'RECEIVED',
    PROCESSING = 'PROCESSING',
    DONE = 'DONE',
    DELIVERED = 'DELIVERED',
}

@Entity('order_items')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'service_id', type: 'uuid' })
    serviceId!: string;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    lineTotal!: number;

    @Column({ type: 'enum', enum: OrderItemStatus, default: OrderItemStatus.RECEIVED })
    itemStatus!: OrderItemStatus;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'service_id' })
    service!: Service;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
