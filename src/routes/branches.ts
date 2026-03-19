import { BranchController } from "@controllers/BranchController";
import { RouteOptions } from "@customTypes/routeoptions";
import { toRoute } from "@helpers/toRoute";
import { authorization } from "@middlewares/authorization";
import { setRoles } from "@middlewares/setRoles";
import { Router } from "express";

export default (route: Router) => {
  const branchController = BranchController.initialize();
  const getAllBranches = branchController.getAllBranches.bind(branchController);
  const getBranchById = branchController.getBranchById.bind(branchController);
  const createBranch = branchController.createBranch.bind(branchController);
  const updateBranch = branchController.updateBranch.bind(branchController);
  const deleteBranch = branchController.deleteBranch.bind(branchController);

  const branchRoutes: RouteOptions[] = [
    {
      method: "get",
      path: "/branches",
      action: getAllBranches,
      description: "Get all branches",
      roles: ['user', 'admin'], // Public route
    },
    {
      method: "get",
      path: "/branches/:id",
      action: getBranchById,
      description: "Get branch by ID",
      roles: ['user', 'admin'], // Public route
    },
    {
      method: "post",
      path: "/branches",
      action: createBranch,
      description: "Create a new branch",
      roles: ['admin'], // Protected route
    },
    {
      method: "put",
      path: "/branches/:id",
      action: updateBranch,
      description: "Update branch",
      roles: ['admin'], // Protected route
    },
    {
      method: "delete",
      path: "/branches/:id",
      action: deleteBranch,
      description: "Delete branch (soft delete)",
      roles: ['admin'], // Protected route
    },
  ];

  branchRoutes.forEach((routeConfig) => {
    toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
  });

  return route;
};
