import { CatalogController } from "@controllers/CatalogController";
import { RouteOptions } from "@customTypes/routeoptions";
import { toRoute } from "@helpers/toRoute";
import { authorization } from "@middlewares/authorization";
import { setRoles } from "@middlewares/setRoles";
import { Router } from "express";

export default (route: Router) => {
  const catalogController = CatalogController.initialize();
  const getAllCategories = catalogController.getAllCategories.bind(catalogController);
  const getCategoryById = catalogController.getCategoryById.bind(catalogController);
  const createCategory = catalogController.createCategory.bind(catalogController);
  const updateCategory = catalogController.updateCategory.bind(catalogController);
  const deleteCategory = catalogController.deleteCategory.bind(catalogController);
  const getAllProducts = catalogController.getAllProducts.bind(catalogController);
  const getProductById = catalogController.getProductById.bind(catalogController);
  const createProduct = catalogController.createProduct.bind(catalogController);
  const updateProduct = catalogController.updateProduct.bind(catalogController);
  const deleteProduct = catalogController.deleteProduct.bind(catalogController);
  const getAllServices = catalogController.getAllServices.bind(catalogController);
  const getServiceById = catalogController.getServiceById.bind(catalogController);
  const createService = catalogController.createService.bind(catalogController);
  const updateService = catalogController.updateService.bind(catalogController);
  const deleteService = catalogController.deleteService.bind(catalogController);
  const getAllPricing = catalogController.getAllPricing.bind(catalogController);
  const getPricingById = catalogController.getPricingById.bind(catalogController);
  const createPricing = catalogController.createPricing.bind(catalogController);
  const updatePricing = catalogController.updatePricing.bind(catalogController);
  const deletePricing = catalogController.deletePricing.bind(catalogController);

  const routes: RouteOptions[] = [
    {
      method: "get",
      path: "/categories",
      action: getAllCategories,
      description: "Get all categories",
      roles: [],
    },
    {
      method: "get",
      path: "/categories/:id",
      action: getCategoryById,
      description: "Get category by ID",
      roles: [],
    },
    {
      method: "post",
      path: "/categories",
      action: createCategory,
      description: "Create category",
      roles: [],
    },
    {
      method: "put",
      path: "/categories/:id",
      action: updateCategory,
      description: "Update category",
      roles: [],
    },
    {
      method: "delete",
      path: "/categories/:id",
      action: deleteCategory,
      description: "Delete category",
      roles: [],
    },
    {
      method: "get",
      path: "/products",
      action: getAllProducts,
      description: "Get all products",
      roles: [],
    },
    {
      method: "get",
      path: "/products/:id",
      action: getProductById,
      description: "Get product by ID",
      roles: [],
    },
    {
      method: "post",
      path: "/products",
      action: createProduct,
      description: "Create product",
      roles: [],
    },
    {
      method: "put",
      path: "/products/:id",
      action: updateProduct,
      description: "Update product",
      roles: [],
    },
    {
      method: "delete",
      path: "/products/:id",
      action: deleteProduct,
      description: "Delete product",
      roles: [],
    },
    {
      method: "get",
      path: "/services",
      action: getAllServices,
      description: "Get all services",
      roles: [],
    },
    {
      method: "get",
      path: "/services/:id",
      action: getServiceById,
      description: "Get service by ID",
      roles: [],
    },
    {
      method: "post",
      path: "/services",
      action: createService,
      description: "Create service",
      roles: [],
    },
    {
      method: "put",
      path: "/services/:id",
      action: updateService,
      description: "Update service",
      roles: [],
    },
    {
      method: "delete",
      path: "/services/:id",
      action: deleteService,
      description: "Delete service",
      roles: [],
    },
    {
      method: "get",
      path: "/pricing",
      action: getAllPricing,
      description: "Get all pricing rows",
      roles: [],
    },
    {
      method: "get",
      path: "/pricing/:id",
      action: getPricingById,
      description: "Get pricing by ID",
      roles: [],
    },
    {
      method: "post",
      path: "/pricing",
      action: createPricing,
      description: "Create pricing row",
      roles: [],
    },
    {
      method: "put",
      path: "/pricing/:id",
      action: updatePricing,
      description: "Update pricing row",
      roles: [],
    },
    {
      method: "delete",
      path: "/pricing/:id",
      action: deletePricing,
      description: "Delete pricing row",
      roles: [],
    },
  ];

  routes.forEach((routeConfig) => {
    toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
  });

  return route;
};
