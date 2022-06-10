import { Router } from "express";

import validateSchema from "../middleware/joiValidation.js";
import {urlSchema} from "../schemas/schemas.js"
import { urlShortener } from "../controller/urlController.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", (req,res,next) => {validateSchema(req,res,next,urlSchema)}, urlShortener);
urlRouter.get("/urls/:id");
urlRouter.get("/urls/open/:shortUrl");
urlRouter.delete("/urls/:id");

export default urlRouter