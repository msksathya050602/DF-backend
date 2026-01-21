import { Database } from '@components/database';

import { APPLICATION_NAME } from '@/config';
import { dbSource } from '@/dbConfig';

import { fetchHealthcheck } from './healthCheck';

export async function healthStatusChecker() {
    const initializeDatabase = Database.initialize(dbSource);
    const isDbAvailable = initializeDatabase.isDbAvailable.bind(initializeDatabase);
    const [result] = await Promise.all([
        fetchHealthcheck({
            applicationName: APPLICATION_NAME,
            db: isDbAvailable,
            environment: process.env.NODE_ENV!,
        }),
    ]);
    return {
        result,
    };
}
