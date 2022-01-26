const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const async = require("hbs/lib/async")
const User = require("../src/models/userModel")

const loginrequired = async (req,res,next)=>{
    const token = req.cookies["access-token"]
    if(token){
        const validatetoken = await jwt.verify(token,process.env.JWT_SECRET)
        if(validatetoken){
            res.user = validatetoken.id
            next()
        }
        else{
            console.log("Token Expires")
            res.redirect("/user/login")
        }
    }
    else{
        console.log("Token Not Found")
        res.redirect("/user/login")
    }
}

const verifyEmail = async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(user.isVerified){
            next()
        }else{
            console.log("Please Check Your Email to Verify mail ")
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {loginrequired, verifyEmail}