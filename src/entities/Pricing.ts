import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Product } from './Product';
import { Service } from './Service';

@Entity('pricing')
@Unique('UQ_pricing_product_service', ['productId', 'serviceId'])
export class Pricing extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'service_id', type: 'uuid' })
    serviceId!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'varchar', length: 8, default: 'INR' })
    currency!: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @ManyToOne(() => Product, product => product.pricing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => Service, service => service.pricing, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service!: Service;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
