import { CustomRequest } from '@customTypes/customRequest';
import { BranchService } from '@services/BranchService';
import { NextFunction, Response } from 'express';
import { body, param } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

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

    public getAllBranches = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const branches = await BranchService.getAllBranches();
            return this.ok(res, { branches });
        } catch (error) {
            return this.internalServerError(res, (error as Error)?.message || 'Failed to fetch branches');
        }
    };

    public getBranchById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid branch ID is required')]);
            const { id } = req.params;
            const branch = await BranchService.getBranchById(id);
            if (!branch) {
                return this.notFound(res, 'Branch not found');
            }
            return this.ok(res, { branch });
        } catch (error) {
            next(error);
        }
    };

    public createBranch = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                body('branchName').isString().trim().notEmpty().withMessage('Branch name is required'),
                body('branchAddress').optional().isString().trim(),
                body('branchPhone').optional().isString().trim(),
            ]);
            const { branchName, branchAddress, branchPhone } = req.body;
            const branch = await BranchService.createBranch({ branchName, branchAddress, branchPhone });
            return this.created(res, { branch });
        } catch (error) {
            next(error);
        }
    };

    public updateBranch = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [
                param('id').isUUID().withMessage('Valid branch ID is required'),
                body('branchName').optional().isString().trim().notEmpty(),
                body('branchAddress').optional().isString().trim(),
                body('branchPhone').optional().isString().trim(),
                body('isActive').optional().isBoolean(),
            ]);
            const { id } = req.params;
            const { branchName, branchAddress, branchPhone, isActive } = req.body;
            const branch = await BranchService.updateBranch(id, {
                branchName,
                branchAddress,
                branchPhone,
                isActive,
            });
            return this.ok(res, { branch });
        } catch (error) {
            next(error);
        }
    };

    public deleteBranch = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            await validateRequest(req, [param('id').isUUID().withMessage('Valid branch ID is required')]);
            const { id } = req.params;
            await BranchService.deleteBranch(id);
            return this.ok(res, { message: 'Branch deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}
