import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { userRouter } from "./modules/user/routes/user.routes";
import { GlobalConfig } from "./config/config";


const app: Application = express();
const { PORT } = GlobalConfig;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json());
app.use('/users', userRouter);

app.listen(PORT, () => console.log('Server listening on port', PORT));
