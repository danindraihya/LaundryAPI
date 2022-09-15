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
const layanan_1 = __importDefault(require("../model/layanan"));
const helper_1 = require("../utils/helper");
const express_validator_1 = require("express-validator");
const unit_1 = __importDefault(require("../model/unit"));
const router = express_1.default.Router();
router.post('/layanan', (0, express_validator_1.check)('nama') // check parameter nama
    .isLength({ max: 50 })
    .withMessage('maximum nama length is 50 characters'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let dataJWT;
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return {
            param: param,
            msg: msg
        };
    };
    // check user is authorized
    try {
        dataJWT = (0, helper_1.authenticateJWT)(req, res, next);
        if (!dataJWT) {
            return res.status(403).json({
                "code": 403,
                "status": "failed",
                "message": "Unauthorized"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            "code": 403,
            "status": "failed",
            "message": "Unauthorized"
        });
    }
    dataJWT = Object(dataJWT);
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            message: errors.array()
        });
    }
    // check if unit exists
    const dataUnit = new unit_1.default();
    dataUnit.Nama = req.body.unit;
    let isUnitExists = yield dataUnit.getUnitByNama();
    if (!isUnitExists) {
        return res.status(400).json({
            code: 400,
            status: "failed",
            message: `Unit '${dataUnit.Nama}' not available`
        });
    }
    let namaLayanan = req.body.nama;
    let unit = req.body.unit;
    let hargaLayanan = req.body.harga;
    let formattedHargaLayanan = hargaLayanan.replace(/[^0-9,]+/g, "");
    formattedHargaLayanan = formattedHargaLayanan.replace(",", ".");
    const newLayanan = new layanan_1.default();
    newLayanan.Nama = namaLayanan;
    newLayanan.NamaUnit = unit;
    newLayanan.Harga = parseFloat(formattedHargaLayanan);
    newLayanan.UserID = dataJWT.ID;
    let result = yield newLayanan.createLayanan();
    if (result['affectedRows'] > 0) {
        return res.status(200).json({
            "code": 200,
            "status": "success",
            "data": {
                id: result['insertId'],
                nama: namaLayanan,
                unit: unit,
                harga: hargaLayanan,
                User_id: dataJWT['Kode']
            }
        });
    }
    else {
        return res.status(400).json({
            "code": 400,
            "status": "failed",
            "message": `fail create new layanan`
        });
    }
}));
module.exports = router;
