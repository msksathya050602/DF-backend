import { CustomRequest } from '@customTypes/customRequest';
import { AnalyticsService, resolveAnalyticsPeriod } from '@services/AnalyticsService';
import { NextFunction, Response } from 'express';
import { query } from 'express-validator';

import { validateRequest } from '../helpers/validateRequest';
import { BaseController } from './baseController';

export class AnalyticsController extends BaseController {
    private static instance: AnalyticsController;

    private constructor() {
        super();
    }

    public static initialize(): AnalyticsController {
        if (!AnalyticsController.instance) {
            AnalyticsController.instance = new AnalyticsController();
        }
        return AnalyticsController.instance;
    }

    /** KPIs, status mix, daily revenue, top catalogue lines, branch mix — filtered by bill date (`createdAt`). */
    public async getOverview(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
        try {
            await validateRequest(req, [
                query('from')
                    .optional({ values: 'falsy' })
                    .matches(/^\d{4}-\d{2}-\d{2}$/)
                    .withMessage('from must be YYYY-MM-DD'),
                query('to')
                    .optional({ values: 'falsy' })
                    .matches(/^\d{4}-\d{2}-\d{2}$/)
                    .withMessage('to must be YYYY-MM-DD'),
                query('branchId').optional({ values: 'falsy' }).isUUID().withMessage('branchId must be a UUID'),
            ]);

            const fromQ = typeof req.query?.from === 'string' ? req.query.from : undefined;
            const toQ = typeof req.query?.to === 'string' ? req.query.to : undefined;
            const branchId = typeof req.query?.branchId === 'string' && req.query.branchId.trim() ? req.query.branchId.trim() : undefined;

            const period = resolveAnalyticsPeriod(fromQ, toQ);
            const data = await AnalyticsService.getOverview({ period, branchId });

            return this.ok(res, {
                period: {
                    from: period.fromYmd,
                    to: period.toYmd,
                },
                branchId: branchId ?? null,
                ...data,
            });
        } catch (error: any) {
            if (error?.message?.includes('Invalid period')) {
                return this.badRequest(res, error.message);
            }
            next(error);
        }
    }
}
