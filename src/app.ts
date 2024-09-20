import path from "path";
import "reflect-metadata";
import express from 'express';
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./config/database/data-source";
import { authorizationInterceptor, currentUserInterceptor } from "./config/http/interceptors";

const app = express();
dotenv.config(); 

useExpressServer(app, {
    cors: {
        origin: "*"
    },
    authorizationChecker: authorizationInterceptor,
    currentUserChecker: currentUserInterceptor,
    controllers: [path.join(__dirname + '/controllers/**/*.controller.ts')]
});

app.use(express.static('public'));
app.use('/images', express.static('images'));

AppDataSource.initialize();

app.listen(3333, () => {
    console.log("Server is running in port 3333");
});