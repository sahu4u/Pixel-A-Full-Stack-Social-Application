const User=require('../models/User');
const Post=require('../models/Post')
const router=require('express').Router();
const bcrypt=require('bcrypt');


//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.user.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password= await bcrypt.hash(req.body.password, salt);
            }
            catch(err){
                return res.status(500).json("ERROR : "+err);
            }
        }
        try{
            const user= await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            res.status(200).json("Account has been updated")
        }
        catch(err){
            return res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can delete only your account");
    }
})

//delet user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
        try{
            const user= await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        }
        catch(err){
            return res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can delete only your account");
    }

})

//Get a user

router.get("/",async(req,res)=>{

        const userId=req.query.userId;
        const username=req.query.username;

        try{
            const user= userId 
            ? await User.findById(userId)
            : await User.findOne({username:username})
            const {password,updatedAt,...other}=user._doc
            
            res.status(200).json(user)
            // console.log("I AM WORKINGGG")
        }
        catch(err){
            res.status(500).json("ERROR : "+err);
        }

    
})
//get a friends

router.get("/friends/:userId", async(req,res)=>{
    try{

        let friendList =[];
        const user =await User.findById(req.params.userId)
        
            const friends= await Promise.all(
                user.following.map(friendId=>{
                    return User.findById(friendId)
                })
            )
            friends.map((friend)=>{
                const {_id,username,profilePicture}=friend;
                friendList.push({ _id, username, profilePicture})
            })

            res.status(200).json(friendList)
        
        // console.log(friendList)
    }
    catch(err){
        res.status(500).json("ERROR : "+err);
    }
})

//follow a user

router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
         
            
            const user= await User.findById(req.params.id);
            const currentUser= await User.findById(req.body.userId);

           
            
            if(!((user.followers).includes(req.body.userId)))
            {
                console.log("Follow page 2!! is workingg")
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User has been followed")
            }
            else{
                console.log("Follow page3!! is workingg")
                res.status(403).json("You already follow");
            }
        }
        catch(err){
            res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can not follow yourself");
    }
    
})

router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            console.log("Follow page!! is workingg")
            
            const user= await User.findById(req.params.id);
            const currentUser= await User.findById(req.body.userId);

            console.log("HMMM"+(user.followers).includes(req.body.userId))
            
            if(((user.followers).includes(req.body.userId)))
            {
                console.log("Follow page 2!! is workingg")
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been unfollowed")
            }
            else{
                console.log("Follow page3!! is workingg")
                res.status(403).json("You already unfollow");
            }
        }
        catch(err){
            console.log("Follow page4!! is workingg")
            res.status(500).json("ERROR : "+err);
        }

    }
    else{
        return res.status(403).json("You can not unfollow yourself");
    }
    
})

//save a post
router.put("/:id/save",async(req,res)=>{//here id is the id of the post which has to be saved
    try{
        const post=await Post.findById(req.params.id);
        const user=await User.findById(req.body.userId);
        if(!user.saved.includes(req.params.id)){
            await user.updateOne({$push:{saved:req.params.id}});
            res.status(200).json("Post has been saved successfully!!")
        }
        else{
            await user.updateOne({$pull:{saved:req.params.id}})
            res.status(200).json("Post has been unsaved!!")
        }

    }
    catch(err){
        res.status(500).json("ERROR : "+err);
    }
})

//to get the saved post of the user
router.get("/saved/:id", async (req,res)=>{    //here id is the id of a User who want to save the post
    let postArray=[];
    try{
        const currentUser= await User.findById(req.params.id)
        const savedPosts= await Promise.all(
            currentUser.saved.map(savedId=>{
              return  Post.find({_id: savedId})
            })
        )
        res.status(200).json(savedPosts)
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }
})

//to change the coverImage
router.put("/cover/:id", async (req,res)=>{
    const user=await User.findById(req.params.id);
    
    try{
        
        await user.updateOne({$set:req.body})
        res.status(200).json("Image has been changed successfully!!"+user)
    }
    catch(err){
        res.status(500).json("ERROR : "+err);
    }
})

//to change the profilePicture
router.put("/profile/:id", async (req,res)=>{
    const user=await User.findById(req.params.id);
    
    try{
        
        await user.updateOne({$set:req.body})
        res.status(200).json("Image has been changed successfully!!"+user)
    }
    catch(err){
        res.status(500).json("ERROR : "+err);
    }
})



module.exports=router