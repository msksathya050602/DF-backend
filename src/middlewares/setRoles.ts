import { CustomRequest } from "@customTypes/customRequest";
import { NextFunction, Response } from "express";

export const setRoles =
  (roles: string[]) => (req: CustomRequest, res: Response, next: NextFunction) => {
    req.roles = roles;
    next();
  };
