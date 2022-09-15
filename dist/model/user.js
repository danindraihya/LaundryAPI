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
class User {
    constructor(Nama, Username, Password, Telepon) {
        this.ID = 0;
        this.Kode = "";
        this.Nama = Nama !== null && Nama !== void 0 ? Nama : "";
        this.Username = Username !== null && Username !== void 0 ? Username : "";
        this.Password = Password !== null && Password !== void 0 ? Password : "";
        this.Telepon = Telepon !== null && Telepon !== void 0 ? Telepon : "";
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db_1.DatabaseConnection.getInstance();
            try {
                // check if user already exists
                let [resultDataUser, _] = yield connection.execute(`SELECT * FROM User WHERE username = '${this.Username}'`);
                let [resultHighestID,] = yield connection.execute(`SELECT MAX(ID) as MAXID FROM User`);
                let listUsers = Object(resultDataUser);
                let dataHighestID = Object(resultHighestID)[0];
                // if user does not exists then create new user
                if (listUsers.length < 1) {
                    const [resultInsertTemp, _] = yield connection.execute(`INSERT INTO User (nama, username, password, telepon) VALUES (?, ?, ?, ?)`, [this.Nama, this.Username, this.Password, this.Telepon]);
                    let resultInsertFinal = Object(resultInsertTemp);
                    let kodeID = "USR";
                    if (resultInsertFinal['insertId'] <= 9) {
                        kodeID += "00" + resultInsertFinal['insertId'];
                    }
                    else if (resultInsertFinal['insertId'] <= 99) {
                        kodeID += "0" + resultInsertFinal['insertId'];
                    }
                    else {
                        kodeID += resultInsertFinal['insertId'];
                    }
                    const [resultUpdateTemp,] = yield connection.execute(`UPDATE User SET Kode = ? WHERE ID = ?`, [kodeID, resultInsertFinal['insertId']]);
                    let resultUpdateFinal = Object(resultUpdateTemp);
                    return resultUpdateFinal;
                }
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getByUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbConn = yield db_1.DatabaseConnection.getInstance();
            try {
                // get user by username
                let [result,] = yield dbConn.execute(`SELECT * FROM User WHERE username = '${this.Username}'`);
                let user = Object(result);
                // check if user exists
                if (user.length > 0) {
                    return user;
                }
                return false;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getUserByID() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbConn = yield db_1.DatabaseConnection.getInstance();
            try {
                // get user by ID
                let [result,] = yield dbConn.execute(`SELECT * FROM User WHERE ID = '${this.ID}'`);
                let user = Object(result);
                // check if user exists
                if (user.length > 0) {
                    return user;
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
module.exports = User;
