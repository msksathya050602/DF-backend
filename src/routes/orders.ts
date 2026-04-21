import { OrderController } from '@controllers/OrderController';
import { RouteOptions } from '@customTypes/routeoptions';
import { toRoute } from '@helpers/toRoute';
import { authorization } from '@middlewares/authorization';
import { setRoles } from '@middlewares/setRoles';
import { Router } from 'express';

export default (route: Router) => {
    const orderController = OrderController.initialize();
    const getAllOrders = orderController.getAllOrders.bind(orderController);
    const searchOrdersByPhone = orderController.searchOrdersByPhone.bind(orderController);
    const getOrderById = orderController.getOrderById.bind(orderController);
    const createOrder = orderController.createOrder.bind(orderController);
    const updateOrderStatus = orderController.updateOrderStatus.bind(orderController);
    const updatePaymentStatus = orderController.updatePaymentStatus.bind(orderController);
    const updateOrderItemStatus = orderController.updateOrderItemStatus.bind(orderController);
    const cancelOrder = orderController.cancelOrder.bind(orderController);

    const orderRoutes: RouteOptions[] = [
        {
            method: 'get',
            path: '/orders',
            action: getAllOrders,
            description: 'Get all orders',
            roles: [],
        },
        {
            method: 'get',
            path: '/orders/search',
            action: searchOrdersByPhone,
            description: 'Search orders by customer phone',
            roles: [],
        },
        {
            method: 'get',
            path: '/orders/:id',
            action: getOrderById,
            description: 'Get order by ID',
            roles: [],
        },
        {
            method: 'post',
            path: '/orders',
            action: createOrder,
            description: 'Create order with order items',
            roles: [],
        },
        {
            method: 'patch',
            path: '/orders/:id/status',
            action: updateOrderStatus,
            description: 'Update order status',
            roles: [],
        },
        {
            method: 'patch',
            path: '/orders/:id/payment-status',
            action: updatePaymentStatus,
            description: 'Update order payment status',
            roles: [],
        },
        {
            method: 'patch',
            path: '/order-items/:id/status',
            action: updateOrderItemStatus,
            description: 'Update order item status',
            roles: [],
        },
        {
            method: 'delete',
            path: '/orders/:id',
            action: cancelOrder,
            description: 'Cancel order (soft delete)',
            roles: [],
        },
    ];

    orderRoutes.forEach(routeConfig => {
        toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
    });

    return route;
};
