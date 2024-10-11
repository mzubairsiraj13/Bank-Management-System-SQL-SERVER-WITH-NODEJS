import express, { json, urlencoded } from "express";
import cors from "cors";
import { ALLOWED_CORS_ORIGIN } from "./constants.js";
import cookieParser from "cookie-parser"





const app = express();

// Middlewares


app.use(cors(
    {
        origin: ALLOWED_CORS_ORIGIN || '*',
        credentials: true,
    }
));

app.use(json({limit: "16kb"}));
app.use(urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());




// Routes Imports
import userRouter from "./routes/user.routes.js";
import accountRouter from "./routes/account.router.js"
import transactionsRouter from "./routes/transactions.routes.js"







//Routes Implementations
app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)
app.use("/api/v1/transactions", transactionsRouter)





export {
    app,
}