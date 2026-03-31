import { OperationsController } from '@controllers/OperationsController';
import { RouteOptions } from '@customTypes/routeoptions';
import { toRoute } from '@helpers/toRoute';
import { authorization } from '@middlewares/authorization';
import { setRoles } from '@middlewares/setRoles';
import { Router } from 'express';

export default (route: Router) => {
    const operationsController = OperationsController.initialize();
    const getTodayDeliveryOrders = operationsController.getTodayDeliveryOrders.bind(operationsController);
    const updateDeliveryOrderStatus = operationsController.updateDeliveryOrderStatus.bind(operationsController);

    const deliveryRoutes: RouteOptions[] = [
        {
            method: 'get',
            path: '/deliveries/today',
            action: getTodayDeliveryOrders,
            description: "Get today's delivery orders",
            roles: [],
        },
        {
            method: 'patch',
            path: '/deliveries/orders/:id/status',
            action: updateDeliveryOrderStatus,
            description: 'Update delivery order/payment status',
            roles: [],
        },
    ];

    deliveryRoutes.forEach(routeConfig => {
        toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
    });

    return route;
};
