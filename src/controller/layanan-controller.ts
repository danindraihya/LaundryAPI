import express, { Application, Request, Response, NextFunction } from 'express';
import Layanan from '../model/layanan';
import { authenticateJWT } from '../utils/helper';
import { body, validationResult, CustomValidator, check, ValidationError } from 'express-validator';
import Unit from '../model/unit';

const router = express.Router();

router.post(
    '/layanan',

    check('nama') // check parameter nama
        .isLength({max: 50})
            .withMessage('maximum nama length is 50 characters'),

    async (req: Request, res: Response, next: NextFunction) => {
    let dataJWT;

    const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {

        return {
            param: param,
            msg: msg
        };
    };

    // check user is authorized
    try {
        dataJWT = authenticateJWT(req, res, next);
        if(!dataJWT) {
            return res.status(403).json({
                "code": 403,
                "status": "failed",
                "message": "Unauthorized"
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            "code": 403,
            "status": "failed",
            "message": "Unauthorized"
        });
    }

    dataJWT = Object(dataJWT);

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "failed", 
            message: errors.array() 
        });
    }

    // check if unit exists
    const dataUnit = new Unit();
    dataUnit.Nama = req.body.unit;
    let isUnitExists = await dataUnit.getUnitByNama();

    if(!isUnitExists) {
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

    const newLayanan = new Layanan();
    newLayanan.Nama = namaLayanan;
    newLayanan.NamaUnit = unit;
    newLayanan.Harga = parseFloat(formattedHargaLayanan);
    newLayanan.UserID = dataJWT.ID;

    let result = await newLayanan.createLayanan();

    if(result['affectedRows'] > 0) {
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
      } else {
        return res.status(400).json({
          "code": 400,
          "status": "failed",
          "message": `fail create new layanan`
        })
      }

});

export = router;