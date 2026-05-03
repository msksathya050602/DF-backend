import { Brackets, Like } from 'typeorm';

import { Customer } from '@/entities/Customer';

export type CreateCustomerInput = {
    firstName: string;
    lastName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
};

export class CustomerService {
    private static instance: CustomerService;

    public static initialize() {
        if (!CustomerService.instance) {
            CustomerService.instance = new CustomerService();
        }
        return CustomerService.instance;
    }

    static async getAllCustomers(): Promise<Customer[]> {
        return await Customer.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    static async getCustomerById(id: string): Promise<Customer | null> {
        return await Customer.findOne({ where: { id } });
    }

    static async createCustomer(data: CreateCustomerInput): Promise<Customer> {
        const customer = Customer.create({
            firstName: data.firstName,
            lastName: data.lastName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            customerAddress: data.customerAddress,
            isActive: true,
        });
        return await customer.save();
    }
    /** Match stored numbers that may include country code or spaces (substring on digits). */
    static async searchCustomersByPhone(phoneDigits: string, limit = 10): Promise<Customer[]> {
        const digits = phoneDigits.replace(/\D/g, '');
        if (digits.length < 2) {
            return [];
        }
        return await Customer.find({
            where: {
                isActive: true,
                customerPhone: Like(`%${digits}%`),
            },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * Match active customers whose full name or first/last name contains the query (case-insensitive).
     * Strips LIKE wildcards from the query to avoid pattern injection.
     */
    static async searchCustomersByName(nameQuery: string, limit = 50): Promise<Customer[]> {
        const trimmed = nameQuery.trim();
        if (trimmed.length < 2) {
            return [];
        }
        const sane = trimmed.replace(/[%_\\]/g, '');
        if (sane.length < 2) {
            return [];
        }
        const pattern = `%${sane}%`;
        return Customer.createQueryBuilder('c')
            .where('c.isActive = :active', { active: true })
            .andWhere(
                new Brackets(qb => {
                    qb.where("CONCAT(TRIM(COALESCE(c.firstName, '')), ' ', TRIM(COALESCE(c.lastName, ''))) ILIKE :pattern", { pattern })
                        .orWhere('c.firstName ILIKE :pattern', { pattern })
                        .orWhere('c.lastName ILIKE :pattern', { pattern });
                }),
            )
            .orderBy('c.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }
}
