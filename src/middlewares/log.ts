import { CustomRequest } from '@customTypes/customRequest';
import { getClientIp } from '@helpers/getClientIp';
import logger from '@helpers/logger';
import { NextFunction, Response } from 'express';

export function log(req: CustomRequest, res: Response, next: NextFunction) {
    const clientIp = getClientIp(req);
    logger.info(
        req.user?.email
            ? `${req.user?.email} - ${clientIp || 'unknownIp'} Calling [ ${req.method.toUpperCase()} ] ${req.url} endpoint...`
            : `${clientIp || 'unknownIP'} Calling [ ${req.method.toUpperCase()} ] ${req.url} endpoint...`,
        req.headers['x-correlation-id'] as string,
    );
    next();
}
