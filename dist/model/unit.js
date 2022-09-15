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
const db_1 = require("../utils/db");
class Unit {
    constructor(ID, Nama) {
        this.ID = ID !== null && ID !== void 0 ? ID : 0;
        this.Nama = Nama !== null && Nama !== void 0 ? Nama : "";
    }
    createUnit() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.DatabaseConnection.getInstance();
            try {
                // check if user already exists
                let [result, _] = yield connection.execute(`SELECT * FROM Unit WHERE Nama = '${this.Nama}'`);
                let listUsers = Object(result);
                // if user does not exists then create new user
                if (listUsers.length < 1) {
                    const [result,] = yield connection.execute(`INSERT INTO Unit (Nama) VALUES (?)`, [this.Nama]);
                    return result;
                }
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getUnitByNama() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbConn = yield db_1.DatabaseConnection.getInstance();
            try {
                // get unit by nama
                let [result,] = yield dbConn.execute(`SELECT * FROM Unit WHERE Nama = '${this.Nama}'`);
                let unit = Object(result);
                // check if unit exists
                if (unit.length > 0) {
                    return unit[0];
                }
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
module.exports = Unit;
