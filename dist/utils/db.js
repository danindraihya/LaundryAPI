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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
class DatabaseConnection {
    constructor() { }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DatabaseConnection._instanceDB) {
                DatabaseConnection._instanceDB = yield promise_1.default.createConnection(config_1.config.db);
            }
            return DatabaseConnection._instanceDB;
        });
    }
    doQuery(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield DatabaseConnection.getInstance();
            const [results,] = yield conn.execute(sql, params);
            return results;
        });
    }
}
exports.DatabaseConnection = DatabaseConnection;
