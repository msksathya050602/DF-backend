import { Category } from '@/entities/Category';
import { Pricing } from '@/entities/Pricing';
import { Product } from '@/entities/Product';
import { Service } from '@/entities/Service';

export class CatalogService {
    private static readonly MAX_CODE_ATTEMPTS = 10_000;

    private static toCode(name: string): string {
        const base = name
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
        return base || 'ITEM';
    }

    /**
     * Picks first available code: BASE, BASE_2, BASE_3, … (bounded loop for ESLint + safety).
     */
    private static async allocateUniqueCode(options: { base: string; findExisting: (code: string) => Promise<{ id: string } | null>; excludeId?: string }): Promise<string> {
        const { base, findExisting, excludeId } = options;
        let code = base;
        let suffix = 2;
        for (let attempt = 0; attempt < this.MAX_CODE_ATTEMPTS; attempt += 1) {
            const existing = await findExisting(code);
            if (!existing || existing.id === excludeId) return code;
            code = `${base}_${suffix}`;
            suffix += 1;
        }
        throw new Error(`Unable to allocate unique code for base "${base}"`);
    }

    private static async uniqueCategoryCode(name: string, excludeId?: string): Promise<string> {
        const base = this.toCode(name);
        return this.allocateUniqueCode({
            base,
            excludeId,
            findExisting: code => Category.findOne({ where: { categoryCode: code } }),
        });
    }

    private static async uniqueProductCode(name: string, excludeId?: string): Promise<string> {
        const base = this.toCode(name);
        return this.allocateUniqueCode({
            base,
            excludeId,
            findExisting: code => Product.findOne({ where: { productCode: code } }),
        });
    }

    private static async uniqueServiceCode(name: string, excludeId?: string): Promise<string> {
        const base = this.toCode(name);
        return this.allocateUniqueCode({
            base,
            excludeId,
            findExisting: code => Service.findOne({ where: { serviceCode: code } }),
        });
    }

    static async getAllCategories(): Promise<Category[]> {
        return Category.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }

    static async getCategoryById(id: string): Promise<Category | null> {
        return Category.findOne({ where: { id } });
    }

    static async createCategory(data: { categoryName: string }): Promise<Category> {
        const categoryName = data.categoryName.trim();
        const categoryCode = await this.uniqueCategoryCode(categoryName);
        const category = Category.create({
            categoryName,
            categoryCode,
            isActive: true,
        });
        return category.save();
    }

    static async updateCategory(id: string, data: Partial<{ categoryName: string; isActive: boolean }>): Promise<Category | null> {
        const category = await this.getCategoryById(id);
        if (!category) return null;
        if (typeof data.categoryName === 'string') {
            category.categoryName = data.categoryName.trim();
            category.categoryCode = await this.uniqueCategoryCode(category.categoryName, id);
        }
        if (typeof data.isActive === 'boolean') category.isActive = data.isActive;
        return category.save();
    }

    static async deleteCategory(id: string): Promise<boolean> {
        const category = await this.getCategoryById(id);
        if (!category) return false;
        category.isActive = false;
        await category.save();
        return true;
    }

    static async getAllProducts(): Promise<Product[]> {
        return Product.find({
            where: { isActive: true },
            relations: ['category'],
            order: { createdAt: 'DESC' },
        });
    }

    static async getProductById(id: string): Promise<Product | null> {
        return Product.findOne({ where: { id }, relations: ['category'] });
    }

    static async createProduct(data: { categoryId: string; productName: string }): Promise<Product> {
        const productName = data.productName.trim();
        const productCode = await this.uniqueProductCode(productName);
        const product = Product.create({
            categoryId: data.categoryId,
            productName,
            productCode,
            isActive: true,
        });
        return product.save();
    }

    static async updateProduct(
        id: string,
        data: Partial<{
            categoryId: string;
            productName: string;
            isActive: boolean;
        }>,
    ): Promise<Product | null> {
        const product = await this.getProductById(id);
        if (!product) return null;
        if (typeof data.categoryId === 'string') product.categoryId = data.categoryId;
        if (typeof data.productName === 'string') {
            product.productName = data.productName.trim();
            product.productCode = await this.uniqueProductCode(product.productName, id);
        }
        if (typeof data.isActive === 'boolean') product.isActive = data.isActive;
        return product.save();
    }

    static async deleteProduct(id: string): Promise<boolean> {
        const product = await this.getProductById(id);
        if (!product) return false;
        product.isActive = false;
        await product.save();
        return true;
    }

    static async getAllServices(): Promise<Service[]> {
        return Service.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }

    static async getServiceById(id: string): Promise<Service | null> {
        return Service.findOne({ where: { id } });
    }

    static async createService(data: { serviceName: string }): Promise<Service> {
        const serviceName = data.serviceName.trim();
        const serviceCode = await this.uniqueServiceCode(serviceName);
        const service = Service.create({
            serviceName,
            serviceCode,
            isActive: true,
        });
        return service.save();
    }

    static async updateService(id: string, data: Partial<{ serviceName: string; isActive: boolean }>): Promise<Service | null> {
        const service = await this.getServiceById(id);
        if (!service) return null;
        if (typeof data.serviceName === 'string') {
            service.serviceName = data.serviceName.trim();
            service.serviceCode = await this.uniqueServiceCode(service.serviceName, id);
        }
        if (typeof data.isActive === 'boolean') service.isActive = data.isActive;
        return service.save();
    }

    static async deleteService(id: string): Promise<boolean> {
        const service = await this.getServiceById(id);
        if (!service) return false;
        service.isActive = false;
        await service.save();
        return true;
    }

    static async getAllPricing(): Promise<Pricing[]> {
        return Pricing.find({
            where: { isActive: true },
            relations: ['product', 'service', 'product.category'],
            order: { createdAt: 'DESC' },
        });
    }

    static async getPricingById(id: string): Promise<Pricing | null> {
        return Pricing.findOne({
            where: { id },
            relations: ['product', 'service', 'product.category'],
        });
    }

    static async createPricing(data: { productId: string; serviceId: string; price: number; currency?: string }): Promise<Pricing> {
        const pricing = Pricing.create({
            productId: data.productId,
            serviceId: data.serviceId,
            price: data.price,
            currency: data.currency || 'INR',
            isActive: true,
        });
        return pricing.save();
    }

    static async updatePricing(id: string, data: Partial<{ productId: string; serviceId: string; price: number; currency: string; isActive: boolean }>): Promise<Pricing | null> {
        const pricing = await this.getPricingById(id);
        if (!pricing) return null;
        if (typeof data.productId === 'string') pricing.productId = data.productId;
        if (typeof data.serviceId === 'string') pricing.serviceId = data.serviceId;
        if (typeof data.price === 'number') pricing.price = data.price;
        if (typeof data.currency === 'string') pricing.currency = data.currency.trim().toUpperCase();
        if (typeof data.isActive === 'boolean') pricing.isActive = data.isActive;
        return pricing.save();
    }

    static async deletePricing(id: string): Promise<boolean> {
        const pricing = await this.getPricingById(id);
        if (!pricing) return false;
        pricing.isActive = false;
        await pricing.save();
        return true;
    }
}
