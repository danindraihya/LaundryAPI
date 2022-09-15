import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    let jwtKey = process.env.JWTKEY || "";
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        
        let dataJWT = jwt.verify(token, jwtKey);
        return dataJWT;
        
    } else {
    //    return res.sendStatus(401);
        return false;
    }
};
