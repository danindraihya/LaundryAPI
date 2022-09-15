"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authenticateJWT(req, res, next) {
    let jwtKey = process.env.JWTKEY || "";
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let dataJWT = jsonwebtoken_1.default.verify(token, jwtKey);
        return dataJWT;
    }
    else {
        //    return res.sendStatus(401);
        return false;
    }
}
exports.authenticateJWT = authenticateJWT;
;
