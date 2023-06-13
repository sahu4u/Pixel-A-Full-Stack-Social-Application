const User = require('../models/User');
const router=require('express').Router();
const bcrypt=require('bcrypt');

//REGISTER
router.post("/register", async (req,res)=>{

    try{
        //generate new password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(req.body.password, salt);

            //create new user
        const newUser=await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })


        //Save the user and return the response
        const user=await newUser.save();
        res.status(200).json(user)
    }
    catch(err){
        console.log("ERROR FOUND : "+err)
    }
    
    res.send("OKAY!!")
})

//LOG IN
router.post("/login", async (req,res)=>{
    try{
        const user= await User.findOne({email:req.body.email})
        !user && res.status(404).json("user not found")

        const validPassword= await bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(400).json("Wrong Password")

        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }
    
})

module.exports=router