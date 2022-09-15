import express, { Application, Request, Response, NextFunction } from 'express';
import authController from './controller/auth-controller';
import layananController from './controller/layanan-controller';
import dotenv from 'dotenv';

const app: Application = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Restrict
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', authController);
app.use('/api', layananController);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));