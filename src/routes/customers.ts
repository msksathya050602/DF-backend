import { CustomerController } from '@controllers/CustomerController';
import { RouteOptions } from '@customTypes/routeoptions';
import { toRoute } from '@helpers/toRoute';
import { authorization } from '@middlewares/authorization';
import { setRoles } from '@middlewares/setRoles';
import { Router } from 'express';

export default (route: Router) => {
    const customerController = CustomerController.initialize();
    const getAllCustomers = customerController.getAllCustomers.bind(customerController);
    const getCustomerById = customerController.getCustomerById.bind(customerController);
    const getCustomerOrders = customerController.getCustomerOrders.bind(customerController);
    const createCustomer = customerController.createCustomer.bind(customerController);

    const customerRoutes: RouteOptions[] = [
        {
            method: 'get',
            path: '/customers',
            action: getAllCustomers,
            description: 'Get all customers',
            roles: ['user', 'admin'],
        },
        {
            method: 'get',
            path: '/customers/:id/orders',
            action: getCustomerOrders,
            description: 'Get customer order history',
            roles: ['user', 'admin'],
        },
        {
            method: 'get',
            path: '/customers/:id',
            action: getCustomerById,
            description: 'Get customer by ID',
            roles: ['user', 'admin'],
        },
        {
            method: 'post',
            path: '/customers',
            action: createCustomer,
            description: 'Create a new customer',
            roles: ['admin'],
        },
    ];

    customerRoutes.forEach(routeConfig => {
        toRoute(route, routeConfig, [setRoles(routeConfig.roles), authorization, routeConfig.action]);
    });

    return route;
};
