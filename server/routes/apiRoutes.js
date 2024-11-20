import express from "express"
import bodyParser from "body-parser";
import multer from "multer";

const router = express.Router()
const upload = multer({storage: multer.memoryStorage()});

import { createJSON } from "../middleware/billParser.mjs";

router.use(bodyParser.json())

router.post("/parse", upload.single("billImage"), createJSON);

export default router;
