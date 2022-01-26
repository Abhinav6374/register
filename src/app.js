const { urlencoded } = require("express");
const express = require("express");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const app = express();
require("./db/conn")
const userRoute = require("../routes/user")
const homeRoute = require("../routes/home")
const cookieparser = require("cookie-parser")

//middleware

app.use(urlencoded({extended:false}))
app.use(cookieparser())
app.use(express.json())

//template engine
app.set("view engine","hbs")


//routes
app.use("/",homeRoute)
app.use("/user",userRoute)



app.listen(port,()=>{
    console.log(`Listening at Port No. ${port}`)
})