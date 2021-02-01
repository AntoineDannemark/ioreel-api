import "reflect-metadata";
import { createConnection } from 'typeorm';
import { Tenant } from './entities/Tenant';
import tenantHandlers from './handlers/tenants';

const initDB = async(platform) => {
    return await createConnection({
        type: platform,
        database: "ioreel.db",
        location: "default",
        logging: ["error", "query", "schema"],
        synchronize: true,
        entities: [Tenant],
    }).then(async connection => {
        await connection
            .getRepository(Tenant)
            .createQueryBuilder()
            .softDelete()

        return {
            dbReady: connection.isConnected,
            error: null,
        }
    }).catch(err => {
        return {
            dbReady: false,
            error: err,
        }
    })
}

export const api = {
    initDB,
    ...tenantHandlers,
}
