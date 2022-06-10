import { nanoid } from "nanoid";
import chalk from "chalk";
import connection from "../db.js";

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
};

export async function getUrlInfo(req,res){
    const {id} = req.params;

    console.log(id);

    try{
        const url = await connection.query(
            `
            SELECT *
            FROM urls
            WHERE id = $1           
            `,
            [id]
        );

        console.log(url);

        res.status(200).send({id: url.rows[0].id, url: url.rows[0].url, shortUrl: url.rows[0].shortUrl});
    }
    catch(err){
        console.log(chalk.red("Erro ao buscar url"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
};

export async function openUrl(req,res){
    const {shortUrl} = req.params;

    try{
        const url = await connection.query(
            `
            SELECT *
            FROM urls
            WHERE "shortUrl" = $1
            `,
            [shortUrl]
        );
        
        const addVisit = url.rows[0].visitCount + 1
        await connection.query(
            `
            UPDATE urls
            SET "visitCount" = $1
            `,
            [addVisit]
        );

        (url.rowCount === 0)? res.status(404).send("Url não encontrada") : res.redirect(200, url.rows[0].url);
    }
    catch(err){
        console.log("Erro ao buscar url");
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
};

export async function deleteUrl(req,res){
    const {id} = req.params;
    const {authorization} = req.headers;
    const token = authorization.replace('Bearer ', '');

    if(!token) {
        console.log("Tolken não recebido")
        return res.status(401).send("Requisição não autorizada");
    }

    try{

        const session = await connection.query(
            `
            SELECT * 
            FROM sessions
            WHERE token = $1
            `,
            [token]
        );

        if(session.rowCount === 0){
            return res.status(401).send("Sessão não encontrada");
        }

        const url = await connection.query(
            `
            SELECT *
            FROM urls 
            WHERE id = $1
            `,
            [id]
        );

        if(session.rows[0].userId === url.rows[0].userId){
            await connection.query(
                `
                DELETE FROM urls 
                WHERE id = $1
                `,
                [id]
            );

            res.status(204).send("URL deletada");
        }
        else{
            res.status(401).send("URL não pertence a esse usuário");
        }
    }
    catch(err){
        console.log(chalk.red("Erro ao deletar URL"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
}