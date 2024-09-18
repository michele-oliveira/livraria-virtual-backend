import path from "path";
import "reflect-metadata";
import express from 'express';
import dotenv from "dotenv";
import { Action, useExpressServer } from "routing-controllers";
import { AppDataSource } from "./config/database/data-source";
import { User } from "./entities/user.entity";
import { authorizationInterceptor } from "./config/http/interceptors";

const app = express();
dotenv.config(); 

useExpressServer(app, {
    cors: {
        origin: "*"
    },
    authorizationChecker: authorizationInterceptor,
    controllers: [path.join(__dirname + '/controllers/**/*.controller.ts')]
});

app.use(express.static('public'));
app.use('/images', express.static('images'));

AppDataSource.initialize();

app.listen(3333, () => {
    console.log("Server is running in port 3333");
});