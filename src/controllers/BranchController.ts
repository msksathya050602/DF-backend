import { CustomRequest } from "@customTypes/customRequest";
import { BranchService } from "@services/BranchService";
import { Response } from "express";

import { BaseController } from "./baseController";

export class BranchController extends BaseController {
  private static instance: BranchController;

  private constructor() {
    super();
  }

  public static initialize(): BranchController {
    if (!BranchController.instance) {
      BranchController.instance = new BranchController();
    }
    return BranchController.instance;
  }

  public getAllBranches = async (
    req: CustomRequest,
    res: Response,
  ): Promise<void> => {
    await this.tryCall(async () => {
      const branches = await BranchService.getAllBranches();
      this.ok(res, { branches });
    });
  };

  public getBranchById = async (
    req: CustomRequest,
    res: Response,
  ): Promise<void> => {
    await this.tryCall(async () => {
      const { id } = req.params;
      const branch = await BranchService.getBranchById(id);
      if (!branch) {
        this.notFound(res, "Branch not found");
        return;
      }
      this.ok(res, { branch });
    });
  };

  public createBranch = async (
    req: CustomRequest,
    res: Response,
  ): Promise<void> => {
    await this.tryCall(async () => {
      const { name, address, phone } = req.body;
      if (!name) {
        this.badRequest(res, "Branch name is required");
        return;
      }
      const branch = await BranchService.createBranch({ name, address, phone });
      this.created(res, { branch });
    });
  };

  public updateBranch = async (
    req: CustomRequest,
    res: Response,
  ): Promise<void> => {
    await this.tryCall(async () => {
      const { id } = req.params;
      const { name, address, phone, isActive } = req.body;
      const branch = await BranchService.updateBranch(id, {
        name,
        address,
        phone,
        isActive,
      });
      this.ok(res, { branch });
    });
  };

  public deleteBranch = async (
    req: CustomRequest,
    res: Response,
  ): Promise<void> => {
    await this.tryCall(async () => {
      const { id } = req.params;
      await BranchService.deleteBranch(id);
      this.ok(res, { message: "Branch deleted successfully" });
    });
  };
}
