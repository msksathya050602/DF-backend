import { AnalyticsController } from '@controllers/AnalyticsController';
import { RouteOptions } from '@customTypes/routeoptions';
import { toRoute } from '@helpers/toRoute';
import { authorization } from '@middlewares/authorization';
import { setRoles } from '@middlewares/setRoles';
import { Router } from 'express';

export default (route: Router) => {
    const analyticsController = AnalyticsController.initialize();
    const getOverview = analyticsController.getOverview.bind(analyticsController);

    const analyticsRoutes: RouteOptions[] = [
        {
            method: 'get',
            path: '/analytics/overview',
            action: getOverview,
            description: 'Business analytics for orders (revenue, trends, catalogue, branches)',
            roles: [],
        },
    ];

    analyticsRoutes.forEach(routeConfig => {
        toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
    });

    return route;
};
