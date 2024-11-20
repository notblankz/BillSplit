import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import apiRoutes from "./routes/apiRoutes.js"
import dbRoutes from "./routes/dbRoutes.js"
import { connectToDB } from "./config/dbConfig.js"

async function startServer() {
    try {
        await connectToDB()
        const app = express()
        const PORT = process.env.PORT || 5000

        app.use(cors());
        app.use(express.json());

        app.use("/api", apiRoutes);
        app.use("/db/users", dbRoutes);

        app.get("/", (req, res) => {
            res.send("Server is ready")
        })

        app.listen(PORT, () => {
            console.log("Server is running on port 5000")
        })
    } catch (e) {
        throw new Error(e)
    }
}

startServer()
