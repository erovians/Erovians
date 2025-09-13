import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))
//this is for getting data from url
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
//this is used to store the data in our own server
app.use(express.static("public"))

//cookieparser is used to access the cookie and set the cookies
app.use(cookieParser())

export {app}