import { CustomRequest } from '@customTypes/customRequest';
import { STATUSCODES } from '@customTypes/statusCodes';
import { CustomError } from '@helpers/customErrors';
import logger from '@helpers/logger';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import { JWT_KEYS } from '@/config';

export function authorization(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        // For public routes (no roles), still check for token to set req.user for optional authentication
        if (!req.roles || req.roles.length === 0) {
            const access_token = req.headers.authorization || req.query.accessToken || req.cookies?.accessToken;
            const JWT_SECRET = JWT_KEYS['access'];

            // If token is provided, verify and set req.user (optional authentication)
            if (access_token && typeof access_token === 'string') {
                verify(access_token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
                    // Set user if token is valid, but continue even if invalid (optional auth for public routes)
                    if (!err && decoded) {
                        const { email, roles, userId } = decoded as JwtPayload;
                        req.user = Object.freeze({ email, roles, userId });
                    }
                    logger.debug('Bypass Authorization', req.headers['x-correlation-id'] as string);
                    next();
                });
                return;
            } else {
                logger.debug('Bypass Authorization', req.headers['x-correlation-id'] as string);
                next();
            }
        } else {
            // For protected routes (with roles), require valid authentication
            const access_token = req.headers.authorization || req.query.accessToken || req.cookies?.accessToken;
            const JWT_SECRET = JWT_KEYS['access'];

            if (access_token && typeof access_token === 'string') {
                verify(access_token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
                    if (err) {
                        throw new CustomError('Invalid Authorization Token', STATUSCODES.FORBIDDEN);
                    }
                    if (decoded) {
                        const { email, roles, userId } = decoded as JwtPayload;
                        req.user = Object.freeze({ email, roles, userId });
                        if (req.roles) {
                            const rolesArray = Array.isArray(roles) ? roles : [roles];
                            const hasRequiredRole = req.roles.some(requiredRole => rolesArray.includes(requiredRole));

                            if (hasRequiredRole) {
                                next();
                            } else {
                                throw new CustomError('Required Role is missing for Authorization', STATUSCODES.UNAUTHORIZED);
                            }
                        }
                    }
                });
            } else {
                throw new CustomError('Authorization Required', STATUSCODES.UNAUTHORIZED);
            }
        }
    } catch (error) {
        next(error);
    }
}
