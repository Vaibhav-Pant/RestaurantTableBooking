// require("dotenv").config({ path: "./env" });
import connectDB from "../src/config/db.js";
import dotenv from 'dotenv'
import app from '../src/app.js'

// Apply changes in package.json
dotenv.config({
    path: "./env"
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8888,  () => {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    })
})
.catch( (err) => {
    console.log(`DB connection failed with error: ${err}`)
})
