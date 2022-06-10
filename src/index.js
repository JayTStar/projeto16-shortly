import express from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from"dotenv";

import usersRouter from "./router/usersRouter.js";
import urlRouter from "./router/urlsRouter.js"

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(usersRouter);
app.use(urlRouter);

const porta = 4000

app.listen(porta, ()=> console.log(chalk.blue(`Servidor criado na porta ${porta}`)));