import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
import { errorHandler } from "./utilis/Apierror.js"
dotenv.config({
    path:"./.env"
})
app.use(errorHandler)
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server Running At Port :${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MONGO db Connection Failed",error)
})
