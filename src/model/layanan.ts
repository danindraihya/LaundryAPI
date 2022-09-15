import mysql from 'mysql2/promise';
import { DatabaseConnection } from "../utils/db";
import Unit from '../model/unit';

class Layanan {
    ID: number;
    Kode: string;
    Nama: string;
    Harga: number;
    NamaUnit: string;
    UserID: string;

    constructor(Nama?: string, Harga?: number, NamaUnit?: string, UserID?: string) {
        this.ID = 0;
        this.Kode = "";
        this.Nama = Nama ?? "";
        this.Harga = Harga ?? 0;
        this.NamaUnit = NamaUnit ?? "";
        this.UserID = UserID ?? "";
    }

    async createLayanan() {
        const connection: mysql.Connection = await DatabaseConnection.getInstance();

        try {

            const unit = new Unit();
            unit.Nama = this.NamaUnit;

            const dataUnit = await unit.getUnitByNama();

            if (!dataUnit) {
                return false;
            }


            const [resultInsertTemp,] = await connection.execute(`INSERT INTO Layanan (Nama, Harga, UnitID, UserID) VALUES (?, ?, ?, ?)`, [this.Nama, this.Harga, dataUnit.ID, this.UserID]);

            let resultInsertFinal = Object(resultInsertTemp);

            let kodeID = "LYN";

            if (resultInsertFinal['insertId'] <= 9) {
                kodeID += "00" + resultInsertFinal['insertId'];

            } else if (resultInsertFinal['insertId'] <= 99) {
                kodeID += "0" + resultInsertFinal['insertId'];

            } else {
                kodeID += resultInsertFinal['insertId'];
            }

            const [resultUpdateTemp, ] = await connection.execute(`UPDATE Layanan SET Kode = ? WHERE ID = ?`, [kodeID, resultInsertFinal['insertId']]);
                
            let resultUpdateFinal = Object(resultUpdateTemp);
            resultUpdateFinal['insertId'] = kodeID;

            return resultUpdateFinal;

        } catch (error) {
            console.log(error);
            return false;

        }
    }

}

export = Layanan;