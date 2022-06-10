import { nanoid } from "nanoid";
import chalk from "chalk";
import connection from "../db.js";
import { query } from "express";

export async function urlShortener(req,res){
    const body = req.body;
    const {authorization} = req.headers;
    const token = authorization.replace('Bearer ', '');

    if(!token) {
        console.log("Tolken não recebido")
        return res.status(401).send("Requisição não autorizada");
    }

    const shortUrl = nanoid();

    try{

        const request = await connection.query(
            `
            SELECT *
            FROM sessions 
            JOIN users ON users.id = sessions."userId"
            WHERE token=$1
            `,
            [token]
        );

        console.log(request);

        await connection.query(
            `
            INSERT INTO urls (url, "shortUrl", "userId", "visitCount")
            VALUES($1, $2, $3, $4)
            `,
            [body.url, shortUrl, request.rows[0].userId, 0]
        )

        res.status(201).send("Url reduzida");
    }
    catch(err){
        console.log(chalk.red("Erro ao encurtar a url"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}