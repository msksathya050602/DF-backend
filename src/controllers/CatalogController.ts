import { CustomRequest } from '@customTypes/customRequest';
import { CatalogService } from '@services/CatalogService';
import { NextFunction, Response } from 'express';
import { body, param } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

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

    public getAllCategories = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const categories = await CatalogService.getAllCategories();
            return this.ok(res, { categories });
        } catch (error) {
            next(error);
        }
    };

    public getCategoryById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid category ID is required')]);
            const category = await CatalogService.getCategoryById(req.params.id);
            if (!category) {
                return this.notFound(res, 'Category not found');
            }
            return this.ok(res, { category });
        } catch (error) {
            next(error);
        }
    };

    public createCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [body('categoryName').isString().trim().notEmpty().withMessage('Category name is required')]);
            const { categoryName } = req.body;
            const category = await CatalogService.createCategory({ categoryName });
            return this.created(res, { category });
        } catch (error) {
            next(error);
        }
    };

    public updateCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid category ID is required'),
                body('categoryName').optional().isString().trim().notEmpty(),
                body('isActive').optional().isBoolean(),
            ]);
            const category = await CatalogService.updateCategory(req.params.id, req.body);
            if (!category) {
                return this.notFound(res, 'Category not found');
            }
            return this.ok(res, { category });
        } catch (error) {
            next(error);
        }
    };

    public deleteCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid category ID is required')]);
            const deleted = await CatalogService.deleteCategory(req.params.id);
            if (!deleted) {
                return this.notFound(res, 'Category not found');
            }
            return this.ok(res, { message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getAllProducts = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const products = await CatalogService.getAllProducts();
            return this.ok(res, { products });
        } catch (error) {
            next(error);
        }
    };

    public getProductById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid product ID is required')]);
            const product = await CatalogService.getProductById(req.params.id);
            if (!product) {
                return this.notFound(res, 'Product not found');
            }
            return this.ok(res, { product });
        } catch (error) {
            next(error);
        }
    };

    public createProduct = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                body('categoryId').isUUID().withMessage('Valid category ID is required'),
                body('productName').isString().trim().notEmpty().withMessage('Product name is required'),
            ]);
            const { categoryId, productName } = req.body;
            const product = await CatalogService.createProduct({ categoryId, productName });
            return this.created(res, { product });
        } catch (error) {
            next(error);
        }
    };

    public updateProduct = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid product ID is required'),
                body('categoryId').optional().isUUID(),
                body('productName').optional().isString().trim().notEmpty(),
                body('isActive').optional().isBoolean(),
            ]);
            const product = await CatalogService.updateProduct(req.params.id, req.body);
            if (!product) {
                return this.notFound(res, 'Product not found');
            }
            return this.ok(res, { product });
        } catch (error) {
            next(error);
        }
    };

    public deleteProduct = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid product ID is required')]);
            const deleted = await CatalogService.deleteProduct(req.params.id);
            if (!deleted) {
                return this.notFound(res, 'Product not found');
            }
            return this.ok(res, { message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getAllServices = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const services = await CatalogService.getAllServices();
            return this.ok(res, { services });
        } catch (error) {
            next(error);
        }
    };

    public getServiceById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid service ID is required')]);
            const service = await CatalogService.getServiceById(req.params.id);
            if (!service) {
                return this.notFound(res, 'Service not found');
            }
            return this.ok(res, { service });
        } catch (error) {
            next(error);
        }
    };

    public createService = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [body('serviceName').isString().trim().notEmpty().withMessage('Service name is required')]);
            const { serviceName } = req.body;
            const service = await CatalogService.createService({ serviceName });
            return this.created(res, { service });
        } catch (error) {
            next(error);
        }
    };

    public updateService = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid service ID is required'),
                body('serviceName').optional().isString().trim().notEmpty(),
                body('isActive').optional().isBoolean(),
            ]);
            const service = await CatalogService.updateService(req.params.id, req.body);
            if (!service) {
                return this.notFound(res, 'Service not found');
            }
            return this.ok(res, { service });
        } catch (error) {
            next(error);
        }
    };

    public deleteService = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid service ID is required')]);
            const deleted = await CatalogService.deleteService(req.params.id);
            if (!deleted) {
                return this.notFound(res, 'Service not found');
            }
            return this.ok(res, { message: 'Service deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    public getAllPricing = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            const pricing = await CatalogService.getAllPricing();
            return this.ok(res, { pricing });
        } catch (error) {
            next(error);
        }
    };

    public getPricingById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid pricing ID is required')]);
            const pricing = await CatalogService.getPricingById(req.params.id);
            if (!pricing) {
                return this.notFound(res, 'Pricing not found');
            }
            return this.ok(res, { pricing });
        } catch (error) {
            next(error);
        }
    };

    public createPricing = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                body('productId').isUUID().withMessage('Valid product ID is required'),
                body('serviceId').isUUID().withMessage('Valid service ID is required'),
                body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
                body('currency').optional().isString().trim().isLength({ min: 1, max: 8 }),
            ]);
            const { productId, serviceId, price, currency } = req.body;
            const pricing = await CatalogService.createPricing({ productId, serviceId, price, currency });
            return this.created(res, { pricing });
        } catch (error) {
            next(error);
        }
    };

    public updatePricing = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid pricing ID is required'),
                body('productId').optional().isUUID(),
                body('serviceId').optional().isUUID(),
                body('price').optional().isFloat({ min: 0 }),
                body('currency').optional().isString().trim().isLength({ min: 1, max: 8 }),
                body('isActive').optional().isBoolean(),
            ]);
            const pricing = await CatalogService.updatePricing(req.params.id, req.body);
            if (!pricing) {
                return this.notFound(res, 'Pricing not found');
            }
            return this.ok(res, { pricing });
        } catch (error) {
            next(error);
        }
    };

    public deletePricing = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid pricing ID is required')]);
            const deleted = await CatalogService.deletePricing(req.params.id);
            if (!deleted) {
                return this.notFound(res, 'Pricing not found');
            }
            return this.ok(res, { message: 'Pricing deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}
