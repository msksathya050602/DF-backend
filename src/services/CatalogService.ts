import { Category } from "@/entities/Category";
import { Pricing } from "@/entities/Pricing";
import { Product } from "@/entities/Product";
import { Service } from "@/entities/Service";

export class CatalogService {
  static async getAllCategories(): Promise<Category[]> {
    return Category.find({ where: { isActive: true }, order: { createdAt: "DESC" } });
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    return Category.findOne({ where: { id } });
  }

  static async createCategory(data: { categoryName: string; categoryCode: string }): Promise<Category> {
    const category = Category.create({
      categoryName: data.categoryName.trim(),
      categoryCode: data.categoryCode.trim().toUpperCase(),
      isActive: true,
    });
    return category.save();
  }

  static async updateCategory(
    id: string,
    data: Partial<{ categoryName: string; categoryCode: string; isActive: boolean }>,
  ): Promise<Category | null> {
    const category = await this.getCategoryById(id);
    if (!category) return null;
    if (typeof data.categoryName === "string") category.categoryName = data.categoryName.trim();
    if (typeof data.categoryCode === "string") category.categoryCode = data.categoryCode.trim().toUpperCase();
    if (typeof data.isActive === "boolean") category.isActive = data.isActive;
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
      relations: ["category"],
      order: { createdAt: "DESC" },
    });
  }

  static async getProductById(id: string): Promise<Product | null> {
    return Product.findOne({ where: { id }, relations: ["category"] });
  }

  static async createProduct(data: { categoryId: string; productName: string; productCode: string }): Promise<Product> {
    const product = Product.create({
      categoryId: data.categoryId,
      productName: data.productName.trim(),
      productCode: data.productCode.trim().toUpperCase(),
      isActive: true,
    });
    return product.save();
  }

  static async updateProduct(
    id: string,
    data: Partial<{
      categoryId: string;
      productName: string;
      productCode: string;
      isActive: boolean;
    }>,
  ): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) return null;
    if (typeof data.categoryId === "string") product.categoryId = data.categoryId;
    if (typeof data.productName === "string") product.productName = data.productName.trim();
    if (typeof data.productCode === "string") product.productCode = data.productCode.trim().toUpperCase();
    if (typeof data.isActive === "boolean") product.isActive = data.isActive;
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
    return Service.find({ where: { isActive: true }, order: { createdAt: "DESC" } });
  }

  static async getServiceById(id: string): Promise<Service | null> {
    return Service.findOne({ where: { id } });
  }

  static async createService(data: { serviceName: string; serviceCode: string }): Promise<Service> {
    const service = Service.create({
      serviceName: data.serviceName.trim(),
      serviceCode: data.serviceCode.trim().toUpperCase(),
      isActive: true,
    });
    return service.save();
  }

  static async updateService(
    id: string,
    data: Partial<{ serviceName: string; serviceCode: string; isActive: boolean }>,
  ): Promise<Service | null> {
    const service = await this.getServiceById(id);
    if (!service) return null;
    if (typeof data.serviceName === "string") service.serviceName = data.serviceName.trim();
    if (typeof data.serviceCode === "string") service.serviceCode = data.serviceCode.trim().toUpperCase();
    if (typeof data.isActive === "boolean") service.isActive = data.isActive;
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
      relations: ["product", "service", "product.category"],
      order: { createdAt: "DESC" },
    });
  }

  static async getPricingById(id: string): Promise<Pricing | null> {
    return Pricing.findOne({
      where: { id },
      relations: ["product", "service", "product.category"],
    });
  }

  static async createPricing(data: {
    productId: string;
    serviceId: string;
    price: number;
    currency?: string;
  }): Promise<Pricing> {
    const pricing = Pricing.create({
      productId: data.productId,
      serviceId: data.serviceId,
      price: data.price,
      currency: data.currency || "INR",
      isActive: true,
    });
    return pricing.save();
  }

  static async updatePricing(
    id: string,
    data: Partial<{ productId: string; serviceId: string; price: number; currency: string; isActive: boolean }>,
  ): Promise<Pricing | null> {
    const pricing = await this.getPricingById(id);
    if (!pricing) return null;
    if (typeof data.productId === "string") pricing.productId = data.productId;
    if (typeof data.serviceId === "string") pricing.serviceId = data.serviceId;
    if (typeof data.price === "number") pricing.price = data.price;
    if (typeof data.currency === "string") pricing.currency = data.currency.trim().toUpperCase();
    if (typeof data.isActive === "boolean") pricing.isActive = data.isActive;
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
