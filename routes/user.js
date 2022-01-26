require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../src/models/userModel");
const bcrypt =require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser") 
const nodemailer = require("nodemailer");
const async = require("hbs/lib/async");
const {verifyEmail} = require("../config/JWT")

router.get("/register", (req, res) => {
  res.render("register");
});

var transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"EMAIL_ADDRESS",
    pass:"EMAIL_PASS"
  },
  tls:{
    rejectUnauthorized:false
  }
})

router.post("/register",async(req,res)=>{
  try{
      const { name,email,password } = req.body
      const user = new User({
        name,
        email,
        password,
        emailToken:crypto.randomBytes(64).toString("hex"),
        isVerified : false
      })
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password,salt)
      user.password = hashPassword;
      const newUser = await user.save()

      //send Verifiaction mail to user
      var mailOptions = {
        from: ` "Verify your Email" <abhinavkumar6374@gmail.com> `,
        to: user.email,
        subject : `Verify Your Email`,
        html:`<h2> ${user.name}! Thanks for Registering on our Site</h2>
              <h4> Please Verify your mail to contine...</h4>
              <a href = "http://${req.headers.host}/user/verify-email?token=${user.emailToken}"></a>`
      }
      //sending mail
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error)
        }else{
          console.log("Verification email is sent to your gmail account")
        }
      })
      res.redirect("/user/login")
  }
  catch(err){
    console.log(err)
  }
})

router.get("/verify-email", async(req,res)=>{
  try{
    const token =req.query.token
    const user = await User.findOne({emailToken:token})
      if(user){
        user.emailToken = null
        user.isVerified = true
        await user.save()
        res.redirect("/user/login")
      }
  }catch{
    res.redirect("/user/register")
    console.log("Email is not Verified")
  }
})

router.get("/login",(req,res)=>{
    res.render("login")
})

const createToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET)
}

router.post("/login", verifyEmail,async(req,res)=>{
    try{
      const {email,password} = req.body
      const findUser = await User.findOne({ email:email})
      if(findUser){
          const match = await bcrypt.compare(password,findUser.password)
          if(match){
            //create token
              const token = createToken(findUser.id)
              
              //store token in cookie
              res.cookie("access-token",token)
              res.redirect("/dashboard")
          }else{
            console.log("Invalid Password")
          }
      }else{
        console.log("User Not Registered")
      }
    }
    catch(err){
      console.log(err)
    }
})

module.exports = router