import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(uri)

let db;

export async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        console.log(`Using DB: ${dbName}`);
    } catch (err) {
        console.log("Error in connecting to MongoDB");
        throw err;
    }
}

export function getDatabase() {
    if (!db) {
        throw new Error("Database not connected");
    } else {
        return db;
    }
}
