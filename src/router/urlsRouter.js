import { Router } from "express";

import validateSchema from "../middleware/joiValidation.js";
import {urlSchema} from "../schemas/schemas.js"
import { urlShortener, getUrlInfo, openUrl, deleteUrl } from "../controller/urlController.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", (req,res,next) => {validateSchema(req,res,next,urlSchema)}, urlShortener);
urlRouter.get("/urls/:id", getUrlInfo);
urlRouter.get("/urls/open/:shortUrl", openUrl);
urlRouter.delete("/urls/:id", deleteUrl);

export default urlRouter