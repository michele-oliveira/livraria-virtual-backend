import path from "path";
import "reflect-metadata";
import express from 'express';
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";

const app = express();
dotenv.config(); 

useExpressServer(app, {
    cors: {
        origin: "*"
    },
    controllers: [path.join(__dirname + '/controllers/**/*.controller.ts')]
});

app.use(express.static('public'));
app.use('/images', express.static('images'));

app.listen(3333, () => {
    console.log("Server is running in port 3333");
});