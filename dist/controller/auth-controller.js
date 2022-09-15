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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post('/register', 
//validation
(0, express_validator_1.check)('nama') // check parameter nama
    .isLength({ max: 50 })
    .withMessage('maximum nama length is 50 characters'), (0, express_validator_1.check)('username') // check parameter username
    .isLength({ max: 15 })
    .withMessage('maximum username length is 15 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('username must contain letter and number only'), (0, express_validator_1.check)('telepon') // check parameter telepon
    .isLength({ max: 15 })
    .withMessage('maximum telepon length is 15 characters')
    .matches(/^[0-9]+$/)
    .withMessage('telepon must contain number only'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return {
            param: param,
            msg: msg
        };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            errors: errors.array()
        });
    }
    let namaUser = req.body.nama;
    let usernameUser = req.body.username;
    let passwordUser = req.body.password;
    let teleponUser = req.body.telepon;
    const saltRounds = 2;
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const passwordHash = bcrypt_1.default.hashSync(passwordUser, salt);
    const newUser = new user_1.default();
    newUser.Nama = namaUser;
    newUser.Username = usernameUser;
    newUser.Password = passwordHash;
    newUser.Telepon = teleponUser;
    let resultTemp = yield newUser.createUser();
    let resultFinal = Object(resultTemp);
    if (resultFinal['affectedRows'] > 0) {
        return res.status(200).json({
            "code": 200,
            "status": "success",
            "message": "berhasil terdaftar"
        });
    }
    else {
        return res.status(400).json({
            "code": 400,
            "status": "failed",
            "message": `user with username ${usernameUser} already exists`
        });
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let usernameUser = req.body.username;
    let passwordUser = req.body.password;
    const user = new user_1.default();
    user.Username = usernameUser;
    let userData = yield user.getByUsername();
    if (userData.length > 0) {
        userData = userData[0];
        const isPasswordMatch = bcrypt_1.default.compareSync(passwordUser, userData['Password']);
        if (isPasswordMatch) {
            let jwtKey = process.env.JWTKEY || "";
            if (jwtKey == "") {
                res.status(500).json({
                    "code": 500,
                    "status": "failed",
                    "message": "Something wrong in server"
                });
                process.exit(0);
                return;
            }
            const jwtToken = jsonwebtoken_1.default.sign({
                "ID": userData['ID'],
                "Kode": userData['Kode'],
                "Nama": userData['Nama'],
                "Username": userData['Username'],
            }, jwtKey);
            return res.status(200).json({
                "code": 200,
                "status": "success",
                "data": {
                    "id": userData['Kode'],
                    "nama": userData['Nama'],
                    "username": userData['Username'],
                    "token": jwtToken
                }
            });
        }
        else {
            return res.status(401).json({
                "code": 401,
                "status": "failed",
                "message": "Invalid username or password"
            });
        }
    }
    return res.status(400).json({
        "code": 400,
        "status": "failed",
        "message": "User did not exists"
    });
}));
module.exports = router;
