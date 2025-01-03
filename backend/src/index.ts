import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
import { userRouter } from "./modules/user/routes/user.routes";
import { GlobalConfig } from "./config/config";
import path from "path";
import {apartmentPostRouter} from "./modules/apartment-post/routes/apartment-post.routes";


const app: Application = express();
const { PORT } = GlobalConfig;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/users', userRouter);
app.use('/posts', apartmentPostRouter);

app.listen(PORT, () => console.log('Server listening on port', PORT));
