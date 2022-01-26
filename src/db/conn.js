const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/user",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connetion Successful")
}).catch((e)=>{
    console.log("No Connection")
})