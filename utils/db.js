import mongoose from "mongoose";

const db_connect = async () => {
    const con = await mongoose.connect(process.env.DB_URL)
    console.log(`MongoDB connected`)
}

export default db_connect