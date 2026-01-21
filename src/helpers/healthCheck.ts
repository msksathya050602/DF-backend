type HealthCheckOptions = {
    applicationName: string;
    db?: () => Promise<boolean>;
    environment: string;
};

export async function fetchHealthcheck(options: HealthCheckOptions) {
    const { applicationName, db, environment } = options;
    const dbStatus = db ? await db() : true;

    return {
        application: applicationName,
        status: dbStatus ? 'healthy' : 'unhealthy',
        environment,
        timestamp: new Date().toISOString(),
    };
}
