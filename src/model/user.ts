import mysql from 'mysql2/promise';
import { DatabaseConnection } from "../utils/db";

class User {
    ID: number;
    Kode: string;
    Nama: string;
    Username: string;
    Password: string;
    Telepon: string;

    constructor(Nama?: string, Username?: string, Password?: string, Telepon?: string) {
        this.ID = 0;
        this.Kode = "";
        this.Nama = Nama ?? "";
        this.Username = Username ?? "";
        this.Password = Password ?? "";
        this.Telepon = Telepon ?? "";
    }

    async createUser() {
        const connection: mysql.Connection = await DatabaseConnection.getInstance();

        try {

            // check if user already exists

            let [resultDataUser, _] = await connection.execute(`SELECT * FROM User WHERE username = '${this.Username}'`);
            let [resultHighestID,] = await connection.execute(`SELECT MAX(ID) as MAXID FROM User`);

            let listUsers = Object(resultDataUser);
            let dataHighestID = Object(resultHighestID)[0];

            // if user does not exists then create new user
            if (listUsers.length < 1) {
                const [resultInsertTemp, _] = await connection.execute(`INSERT INTO User (nama, username, password, telepon) VALUES (?, ?, ?, ?)`, [this.Nama, this.Username, this.Password, this.Telepon]);
                
                let resultInsertFinal = Object(resultInsertTemp);

                let kodeID = "USR";

                if (resultInsertFinal['insertId'] <= 9) {
                    kodeID += "00" + resultInsertFinal['insertId'];

                } else if (resultInsertFinal['insertId'] <= 99) {
                    kodeID += "0" + resultInsertFinal['insertId'];

                } else {
                    kodeID += resultInsertFinal['insertId'];
                }

                const [resultUpdateTemp, ] = await connection.execute(`UPDATE User SET Kode = ? WHERE ID = ?`, [kodeID, resultInsertFinal['insertId']]);
                
                let resultUpdateFinal = Object(resultUpdateTemp);

                return resultUpdateFinal;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;

        }
    }

    async getByUsername() {
        const dbConn: mysql.Connection = await DatabaseConnection.getInstance();

        try {

            // get user by username

            let [result,] = await dbConn.execute(`SELECT * FROM User WHERE username = '${this.Username}'`);

            let user = Object(result);

            // check if user exists
            if (user.length > 0) {

                return user;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getUserByID() {
        const dbConn: mysql.Connection = await DatabaseConnection.getInstance();

        try {

            // get user by ID

            let [result,] = await dbConn.execute(`SELECT * FROM User WHERE ID = '${this.ID}'`);

            let user = Object(result);

            // check if user exists
            if (user.length > 0) {

                return user;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


export = User;