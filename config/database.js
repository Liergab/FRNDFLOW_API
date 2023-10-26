import mongoose from "mongoose";

const dbConnection = async() => {
    try {
        const db = await mongoose.connect(process.env.URL_MONGODB)
                   console.log(`connected to : ${db.connection.host} ${db.connection.name}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default dbConnection