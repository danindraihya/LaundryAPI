"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const db_1 = require("../utils/db");
const unit_1 = __importDefault(require("../model/unit"));
class Layanan {
    constructor(Nama, Harga, NamaUnit, UserID) {
        this.ID = 0;
        this.Kode = "";
        this.Nama = Nama !== null && Nama !== void 0 ? Nama : "";
        this.Harga = Harga !== null && Harga !== void 0 ? Harga : 0;
        this.NamaUnit = NamaUnit !== null && NamaUnit !== void 0 ? NamaUnit : "";
        this.UserID = UserID !== null && UserID !== void 0 ? UserID : "";
    }
    createLayanan() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.DatabaseConnection.getInstance();
            try {
                const unit = new unit_1.default();
                unit.Nama = this.NamaUnit;
                const dataUnit = yield unit.getUnitByNama();
                if (!dataUnit) {
                    return false;
                }
                const [resultInsertTemp,] = yield connection.execute(`INSERT INTO Layanan (Nama, Harga, UnitID, UserID) VALUES (?, ?, ?, ?)`, [this.Nama, this.Harga, dataUnit.ID, this.UserID]);
                let resultInsertFinal = Object(resultInsertTemp);
                let kodeID = "LYN";
                if (resultInsertFinal['insertId'] <= 9) {
                    kodeID += "00" + resultInsertFinal['insertId'];
                }
                else if (resultInsertFinal['insertId'] <= 99) {
                    kodeID += "0" + resultInsertFinal['insertId'];
                }
                else {
                    kodeID += resultInsertFinal['insertId'];
                }
                const [resultUpdateTemp,] = yield connection.execute(`UPDATE Layanan SET Kode = ? WHERE ID = ?`, [kodeID, resultInsertFinal['insertId']]);
                let resultUpdateFinal = Object(resultUpdateTemp);
                resultUpdateFinal['insertId'] = kodeID;
                return resultUpdateFinal;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
module.exports = Layanan;
