import { BaseController } from "@controllers/baseController";
import { CustomRequest } from "@customTypes/customRequest";
import { STATUSCODES } from "@customTypes/statusCodes";
import { hashPassword } from "@helpers/bcrypt";
import { CustomError } from "@helpers/customErrors";
import { AuthService } from "@services/AuthService";
import { UserService } from "@services/UserService";
import { NextFunction, Request, Response } from "express";

import { REFRESH_TOKEN_MAX_AGE_MS } from "@/config";

export class AuthController extends BaseController {
  public static instance: AuthController;
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    super();
    this.authService = AuthService.initialize();
    this.userService = UserService.initialize();
  }

  public static initialize() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email?: string; password?: string };

      if (!email || !password) {
        return this.badRequest(res, "Email and password are required");
      }

      const user = await this.authService.validateLogin(email, password);
      if (!user) {
        return this.unauthorized(res, "Invalid email or password");
      }

      const [accessToken, refreshToken] = await this.authService.generateToken(
        user.userId,
        user.email,
        user.roles,
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      });

      return this.ok(res, {
        status: STATUSCODES.OK,
        message: "Login successful",
        accessToken,
        refreshToken,
        userId: user.userId,
        roles: user.roles,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, email, password } = req.body as {
        userName?: string;
        email?: string;
        password?: string;
      };

      if (!userName || !email || !password) {
        return this.badRequest(res, "Username, email and password are required");
      }

      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        return this.conflict(res, `User ${email} already exists`);
      }

      const encryptedPassword = await hashPassword(password);
      const user = await this.userService.createUser({
        userName,
        email,
        password: encryptedPassword,
        roles: ["user"],
      });

      const [accessToken, refreshToken] = await this.authService.generateToken(
        user.id,
        user.email,
        user.roles || ["user"],
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      });

      return this.created(res, {
        status: STATUSCODES.CREATED,
        message: "User created successfully",
        accessToken,
        refreshToken,
        userId: user.id,
        roles: user.roles || ["user"],
      });
    } catch (error) {
      next(error);
    }
  }

  public async rotateRefreshToken(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken || typeof refreshToken !== "string") {
        throw new CustomError("Invalid Refresh Token", STATUSCODES.UNAUTHORIZED);
      }

      const decoded = await this.authService.verifyJwt(refreshToken, "refresh");
      const [accessToken] = await this.authService.generateToken(
        decoded.userId,
        decoded.email,
        decoded.roles || [],
      );

      return this.ok(res, {
        status: STATUSCODES.OK,
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken,
        userId: decoded.userId,
        roles: decoded.roles || [],
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return this.unauthorized(res, "Unauthorized");
      }
      const user = await this.userService.getUserById(req.user.userId);
      if (!user) {
        return this.notFound(res, "User not found");
      }

      return this.ok(res, {
        status: STATUSCODES.OK,
        message: "User profile fetched successfully",
        id: user.id,
        userName: user.userName,
        email: user.email,
        roles: user.roles || req.user.roles,
      });
    } catch (error) {
      next(error);
    }
  }

  public async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken");
      return this.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
