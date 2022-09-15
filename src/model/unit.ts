import mysql from 'mysql2/promise';
import { DatabaseConnection } from "../utils/db";

class Unit {
    ID: number;
    Nama: string;

    constructor(ID?: number, Nama?: string) {
        this.ID = ID ?? 0;
        this.Nama = Nama ?? "";
    }

    async createUnit()
    {
        const connection: mysql.Connection = await DatabaseConnection.getInstance();

        try {
            
            // check if user already exists

            let [result, _] = await connection.execute(`SELECT * FROM Unit WHERE Nama = '${this.Nama}'`);

            let listUsers = Object(result);

            // if user does not exists then create new user
            if(listUsers.length < 1) {
                const [result, ] = await connection.execute(`INSERT INTO Unit (Nama) VALUES (?)`, [this.Nama]);
                return result;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
            
        }
    }

    async getUnitByNama()
    {
        const dbConn: mysql.Connection = await DatabaseConnection.getInstance();

        try {

            // get unit by nama
            let [result, ] = await dbConn.execute(`SELECT * FROM Unit WHERE Nama = '${this.Nama}'`);

            let unit = Object(result);

            // check if unit exists
            if(unit.length > 0) {
                return unit[0];
            }

            return false;

        } catch(error) {
            console.log(error);
            return false;
        }
    }
}

export = Unit;