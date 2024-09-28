import dotenv from 'dotenv';
dotenv.config({ path: './env' });
import connectDB from "./db/index.js";

import {app} from './app.js'

app.get("/api/v1/user/register", function(req, res){
    res.send("Hello world");
})

// app.post("/api/v1/user/login", function(req, res){
//     res.send("Hello world");
// })

connectDB()



.then( ()=>{
    app.listen(process.env.PORT || 3002 , ()=>{
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    })
})
.catch((err) => console.log("MONGO  CONNECTION faild !!!!" ,err));



