const mongoose=require('mongoose');

const CommentSchema=new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    postId:{
        type:String,
        require:true
    },

    cmnt:{
        type:String,
        max:500
    },
    
}
,{
    timestamps:true
}
)

module.exports= mongoose.model("Comment",CommentSchema)