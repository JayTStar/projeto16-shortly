import chalk from "chalk";
import connection from "../db.js";

export async function singUp(req,res){
    const body = req.body;

    try{
        const request = await connection.query(
            `SELECT * 
            FROM users 
            WHERE email=$1`,
            [body.email]
        );

        if(request.rows.length > 0) {
            res.status(409).send("Email já cadastrado");
        }
        else{
            await connection.query(
                `
                    INSERT INTO users (name, email, password)
                    VALUES($1, $2, $3);
                `,
                [body.name, body.email, body.password]
            );

            res.status(201).send("Usuario cadastrado")
        }
    }
    catch(err){
        console.log(chalk.red("Erro ao cadastrar usuário"));
        console.log(err);
        res.status(500).send("Erro de conecção");
    }
}