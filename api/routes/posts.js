const Post = require('../models/Post');
const User = require('../models/User')
const router=require('express').Router();

//create a post
router.post("/",async (req,res)=>{

    const newPost=await new Post(req.body)
    try{
        
        const savedPost=await newPost.save();
        res.status(200).json(savedPost)
    }
    catch(err){
        res.status(500).json("ERROR FOUND : "+err)
    }
})

//update a post

router.put("/:id",async(req,res)=>{
    try{
        console.log("tryinggg")
        const post=await Post.findById(req.params.id);
        if(req.body.userId===post.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post has been updated successfully!!")
        }   
        else{
            res.status(403).json("You can only update your post")
        }
    }
    catch(err){
        res.status(500).json("ERROR :"+err)
    }
})

//delete a post
router.delete("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        
            
            await post.deleteOne()
            res.status(200).json("Post has been deleted successfully!!")
    }
    catch(err){
        res.status(500).json("ERROR :"+err)
    }
})


//like a post
router.put("/:id/like",async(req,res)=>{
    try{
        const post=await  Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Post has been liked successfully!!")
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("Post has been unliked successfully!!")
        }
    }
    catch(err){
        res.status(500).json("ERROR :"+err)
    }

})



//get a post
router.get("/:id",async(req,res)=>{
    try{
    const post=await Post.findById(req.params.id);
    res.status(200).json(post)
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }

})




//get a timeline post
router.get("/timeline/:userId", async(req,res)=>{
    let postArray=[];
    try{
        const currentUser= await User.findById(req.params.userId)
        const userPosts= await Post.find({userId: currentUser._id})
        const friendsPosts= await Promise.all(
            currentUser.following.map(friendId=>{
              return  Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendsPosts))
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }
})

//get a user's all post
router.get("/profile/:username", async(req,res)=>{
    let postArray=[];
    try{
        const user= await User.findOne({username:req.params.username})
        const posts= await Post.find({userId:user._id})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }
})



module.exports=router