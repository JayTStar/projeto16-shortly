import { Router } from "express";

const usersRouter = Router();

import { signupSchema, signinSchema } from "../schemas/schemas.js"
import validateSchema from "../middleware/joiValidation.js"
import { singUp, signIn } from "../controller/usersController.js"

usersRouter.post("/signup", (req,res,next) => {validateSchema(req,res,next,signupSchema)}, singUp);
usersRouter.post("/signin", (req,res,next) => {validateSchema(req,res,next,signinSchema)}, signIn);
usersRouter.get("/users/:id");
usersRouter.get("/ranking");

export default usersRouter;