import chalk from "chalk";
import connection from "../db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export async function singUp(req,res){
    const body = req.body;

    if(body.password !== body.confirmPassword){
        res.status(409).send("As senhas informadas não batem");
    }
    else{
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
    
                const encryptedPassword = bcrypt.hashSync(body.password, 10);
    
                await connection.query(
                    `
                        INSERT INTO users (name, email, password)
                        VALUES($1, $2, $3);
                    `,
                    [body.name, body.email, encryptedPassword]
                );
    
                res.status(201).send("Usuario cadastrado");
            }
        }
        catch(err){
            console.log(chalk.red("Erro ao cadastrar usuário"));
            console.log(err);
            res.status(500).send("Erro no servidor");
        }
    }
};

export async function signIn(req,res){
    const body = req.body;

    try{
        const request = await connection.query(
            `SELECT * 
            FROM users 
            WHERE email=$1`,
            [body.email]
        );

        if(request.rows.length === 0){
            res.status(409).send("Usuário não cadastrado");
        }
        else{
            const passwordCheck = bcrypt.compareSync(body.password, request.rows[0].password);

            if(passwordCheck === false){
                res.status(409).send("Senha Incorreta");
            }
            else{

                const {name} = request.rows[0];
                const key = process.env.JWT_SECRET;
                const token = jwt.sign(name,key);

                try{
                    await connection.query(
                        `
                        INSERT INTO sessions (token, "userId")
                        VALUES($1, $2);
                        `,
                        [token, request.rows[0].id]
                    )
                }
                catch(err){
                    console.log(chalk.red("Erro ao registrar sessão"));
                    console.log(err);
                    res.status(500).send("Erro no servidor");
                }

                res.status(200).send({token});
            }
        }
    }
    catch(err){
        console.log(chalk.red("Erro ao fazer signin"));
        console.log(err);
        res.status(500).send("Erro no servidor");
    }
};