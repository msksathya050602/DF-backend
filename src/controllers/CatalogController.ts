import { CustomRequest } from "@customTypes/customRequest";
import { CatalogService } from "@services/CatalogService";
import { Response } from "express";

import { BaseController } from "./baseController";

export class CatalogController extends BaseController {
  private static instance: CatalogController;

  private constructor() {
    super();
  }

  public static initialize(): CatalogController {
    if (!CatalogController.instance) {
      CatalogController.instance = new CatalogController();
    }
    return CatalogController.instance;
  }

  public getAllCategories = async (_req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const categories = await CatalogService.getAllCategories();
      this.ok(res, { categories });
    });
  };

  public getCategoryById = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const category = await CatalogService.getCategoryById(req.params.id);
      if (!category) {
        this.notFound(res, "Category not found");
        return;
      }
      this.ok(res, { category });
    });
  };

  public createCategory = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const { categoryName, categoryCode } = req.body;
      if (!categoryName || !categoryCode) {
        this.badRequest(res, "Category name and category code are required");
        return;
      }
      const category = await CatalogService.createCategory({ categoryName, categoryCode });
      this.created(res, { category });
    });
  };

  public updateCategory = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const category = await CatalogService.updateCategory(req.params.id, req.body);
      if (!category) {
        this.notFound(res, "Category not found");
        return;
      }
      this.ok(res, { category });
    });
  };

  public deleteCategory = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const deleted = await CatalogService.deleteCategory(req.params.id);
      if (!deleted) {
        this.notFound(res, "Category not found");
        return;
      }
      this.ok(res, { message: "Category deleted successfully" });
    });
  };

  public getAllProducts = async (_req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const products = await CatalogService.getAllProducts();
      this.ok(res, { products });
    });
  };

  public getProductById = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const product = await CatalogService.getProductById(req.params.id);
      if (!product) {
        this.notFound(res, "Product not found");
        return;
      }
      this.ok(res, { product });
    });
  };

  public createProduct = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const { categoryId, productName, productCode } = req.body;
      if (!categoryId || !productName || !productCode) {
        this.badRequest(res, "Category ID, product name and product code are required");
        return;
      }
      const product = await CatalogService.createProduct({ categoryId, productName, productCode });
      this.created(res, { product });
    });
  };

  public updateProduct = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const product = await CatalogService.updateProduct(req.params.id, req.body);
      if (!product) {
        this.notFound(res, "Product not found");
        return;
      }
      this.ok(res, { product });
    });
  };

  public deleteProduct = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const deleted = await CatalogService.deleteProduct(req.params.id);
      if (!deleted) {
        this.notFound(res, "Product not found");
        return;
      }
      this.ok(res, { message: "Product deleted successfully" });
    });
  };

  public getAllServices = async (_req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const services = await CatalogService.getAllServices();
      this.ok(res, { services });
    });
  };

  public getServiceById = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const service = await CatalogService.getServiceById(req.params.id);
      if (!service) {
        this.notFound(res, "Service not found");
        return;
      }
      this.ok(res, { service });
    });
  };

  public createService = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const { serviceName, serviceCode } = req.body;
      if (!serviceName || !serviceCode) {
        this.badRequest(res, "Service name and service code are required");
        return;
      }
      const service = await CatalogService.createService({ serviceName, serviceCode });
      this.created(res, { service });
    });
  };

  public updateService = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const service = await CatalogService.updateService(req.params.id, req.body);
      if (!service) {
        this.notFound(res, "Service not found");
        return;
      }
      this.ok(res, { service });
    });
  };

  public deleteService = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const deleted = await CatalogService.deleteService(req.params.id);
      if (!deleted) {
        this.notFound(res, "Service not found");
        return;
      }
      this.ok(res, { message: "Service deleted successfully" });
    });
  };

  public getAllPricing = async (_req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const pricing = await CatalogService.getAllPricing();
      this.ok(res, { pricing });
    });
  };

  public getPricingById = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const pricing = await CatalogService.getPricingById(req.params.id);
      if (!pricing) {
        this.notFound(res, "Pricing not found");
        return;
      }
      this.ok(res, { pricing });
    });
  };

  public createPricing = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const { productId, serviceId, price, currency } = req.body;
      if (!productId || !serviceId || typeof price !== "number") {
        this.badRequest(res, "Product ID, service ID and numeric price are required");
        return;
      }
      const pricing = await CatalogService.createPricing({ productId, serviceId, price, currency });
      this.created(res, { pricing });
    });
  };

  public updatePricing = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const pricing = await CatalogService.updatePricing(req.params.id, req.body);
      if (!pricing) {
        this.notFound(res, "Pricing not found");
        return;
      }
      this.ok(res, { pricing });
    });
  };

  public deletePricing = async (req: CustomRequest, res: Response): Promise<void> => {
    await this.tryCall(async () => {
      const deleted = await CatalogService.deletePricing(req.params.id);
      if (!deleted) {
        this.notFound(res, "Pricing not found");
        return;
      }
      this.ok(res, { message: "Pricing deleted successfully" });
    });
  };
}
 