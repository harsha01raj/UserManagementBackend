const express = require("express");
const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const limiter = require("../middleware/rateLimiter");
require("dotenv").config();

const router = express.Router();

router.post("/register",limiter,async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(404)
        .json({ Message: "User is already exit in database" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ Message: "Something issue in hashing time" });
      }
      user = new UserModel({
        name,
        email,
        password: hash,
        role,
      });
      await user.save();
      res.status(201).json({ "Message": "User registered Successfully",User:user });
    });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

router.post("/login", limiter,async (req, res) => {
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({"Message":"Please register here..."})
        }
        bcrypt.compare(password,user.password,async(err,result)=>{
            if(err||!result){
                return res.status(401).json({"Message":"Wrong Password..."})
            }
            const token=jwt.sign({user:user},process.env.JWT_SECRET,{expiresIn:"1h"});
            res.status(200).json({"Message":"User is successfully login","Token":token});
        })
    } catch (error) {
        res.status(500).json({"Message":error.message})
    }
});

module.exports = router;
