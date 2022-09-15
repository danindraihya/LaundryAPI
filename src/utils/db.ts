import mysql from 'mysql2/promise';
import { config } from './config';

export class DatabaseConnection {
    private static _instanceDB: mysql.Connection;

    private constructor() {}

    public static async getInstance(): Promise<mysql.Connection>
    {   
        if(!DatabaseConnection._instanceDB) {
            DatabaseConnection._instanceDB = await mysql.createConnection(config.db);
        }

        return DatabaseConnection._instanceDB;
    }

    public async doQuery(sql:string, params:string[])
    {
        const conn = await DatabaseConnection.getInstance();
        const [results, ] = await conn.execute(sql, params);

        return results;
    }
}
