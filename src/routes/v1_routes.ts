import { Router } from 'express';

import analytics from './analytics';
import auth from './auth';
import branches from './branches';
import catalog from './catalog';
import customers from './customers';
import deliveries from './deliveries';
import orders from './orders';

const route = Router();

export default function Routes() {
    [auth, analytics, branches, catalog, customers, deliveries, orders].forEach(callback => {
        callback(route);
    });
    return route;
}
