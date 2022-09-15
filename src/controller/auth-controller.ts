import express, { Application, Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator, check, ValidationError } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import User from '../model/user';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post(
  '/register',

  //validation

  check('nama') // check parameter nama
    .isLength({max: 50})
      .withMessage('maximum nama length is 50 characters'),

  check('username') // check parameter username
    .isLength({max:15})
      .withMessage('maximum username length is 15 characters')
    .matches(/^[A-Za-z0-9]+$/)
      .withMessage('username must contain letter and number only'),
      
  check('telepon') // check parameter telepon
    .isLength({max:15})
      .withMessage('maximum telepon length is 15 characters')
    .matches(/^[0-9]+$/)
      .withMessage('telepon must contain number only'),

  async (req: Request, res: Response, next: NextFunction) => {

    const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError) => {
    
      return {
        param: param,
        msg: msg
      };
    };

    const errors = validationResult(req).formatWith(errorFormatter);
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
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(passwordUser, salt);

    const newUser = new User();
    newUser.Nama = namaUser;
    newUser.Username = usernameUser;
    newUser.Password = passwordHash;
    newUser.Telepon = teleponUser;

    let resultTemp = await newUser.createUser();
    let resultFinal = Object(resultTemp);

    if(resultFinal['affectedRows'] > 0) {
      return res.status(200).json({
        "code": 200,
        "status": "success",
        "message": "berhasil terdaftar"
      });
    } else {
      return res.status(400).json({
        "code": 400,
        "status": "failed",
        "message": `user with username ${usernameUser} already exists`
      })
    }

});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {

  let usernameUser = req.body.username;
  let passwordUser = req.body.password;

  const user = new User();
  user.Username = usernameUser;

  let userData = await user.getByUsername();

  if(userData.length > 0) {
    userData = userData[0];
    
    const isPasswordMatch = bcrypt.compareSync(passwordUser, userData['Password']);

    if(isPasswordMatch) {

      let jwtKey = process.env.JWTKEY || "";

      if(jwtKey == "") {
        res.status(500).json({
          "code": 500,
          "status": "failed",
          "message": "Something wrong in server"
        });
        process.exit(0);
        return;
      }
      const jwtToken = jsonwebtoken.sign({
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
    } else {
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

});

export = router;