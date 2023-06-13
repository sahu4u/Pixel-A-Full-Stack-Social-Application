
const router=require('express').Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User')


//create a comment

router.post("/", async (req, res)=>{
    const newComment=await new Comment(req.body)
    try{
        const writtenComment=await newComment.save();
        res.status(200).json(writtenComment)
    }
    catch(err){
        res.status(500).json("ERROR FOUND : "+err)
    }
})

//to get all the comments at the same post
router.get("/:id", async(req,res)=>{ //here id is the id of the post
    let postArray=[];
    try{
        const post= await Post.findOne({_id:req.params.id})
        
        const comments= await Comment.find({postId:post._id})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json("ERROR : "+err)
    }
})


module.exports=router