import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`
        )
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Mongodb connection error", error);
        process.exit(1) //this is feature of node js which helps to exit the current process
    }
}

export default connectDB;