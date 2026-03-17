import { AuthController } from "@controllers/AuthController";
import { RouteOptions } from "@customTypes/routeoptions";
import { toRoute } from "@helpers/toRoute";
import { authorization } from "@middlewares/authorization";
import { setRoles } from "@middlewares/setRoles";
import { Router } from "express";

export default (route: Router) => {
  const authController = AuthController.initialize();
  const createUser = authController.createUser.bind(authController);
  const login = authController.login.bind(authController);
  const refresh = authController.rotateRefreshToken.bind(authController);
  const logout = authController.logout.bind(authController);
  const getMe = authController.getMe.bind(authController);

  const authRoutes: RouteOptions[] = [
    {
      method: "post",
      path: "/users",
      action: createUser,
      description: "register a new user",
      roles: [],
    },
    {
      method: "post",
      path: "/login",
      action: login,
      description: "sign in",
      roles: [],
    },
    {
      method: "post",
      path: "/refresh",
      action: refresh,
      description: "Rotate access token using refresh token",
      roles: [],
    },
    {
      method: "post",
      path: "/logout",
      action: logout,
      description: "Logout current user",
      roles: [],
    },
    {
      method: "get",
      path: "/users/me",
      action: getMe,
      description: "Get current user",
      roles: ["user"],
    },
  ];

  authRoutes.forEach((routeConfig) => {
    toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
  });

  return route;
};
