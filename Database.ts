import { Connection, ConnectionManager, getConnectionManager } from 'typeorm';
import initDB from './initDB';

export type platform = "cordova" | "better-sqlite3"

export type ConnectionOptions = {
    isServerless: boolean 
    platform: platform
}

export default class Database {
    private connectionManager: ConnectionManager;
    private options: ConnectionOptions;

    constructor(options: ConnectionOptions) {
        this.connectionManager = getConnectionManager();
        this.options = options;
    }

    public static getConnectionInstance(options: ConnectionOptions) {
        const ci = new this(options)
        Object.assign(ci, options)
        return ci.getConnection();
    }

    public async getConnection(): Promise<Connection> {
        const CONNECTION_NAME = 'default';

        let connection: Connection

        if (this.connectionManager.has(CONNECTION_NAME)) {
            console.log(`Database.getConnection()-using existing connection ...`)
            connection = await this.connectionManager.get(CONNECTION_NAME)

            if (!connection.isConnected) {
                connection = await connection.connect()
            }
        }
        else {
            console.log(`Database.getConnection()-creating connection ...`);

            connection = await initDB(this.options);
        }

        return connection;
    }
}
