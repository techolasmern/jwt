import "dotenv/config";
import mongoose from "mongoose";

export const createMongoDBConnection = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        await mongoose.connect(process.env.DATABASE_URL, {
          dbName: process.env.DATABASE_NAME  
        })
        return console.log(`Database: ${mongoose.connection.db.databaseName}`);
    } catch (e) {
        return process.exit(1);
    }
}