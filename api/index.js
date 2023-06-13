const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv= require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute=require('./routes/users');
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const multer =require('multer')
const path=require('path')

dotenv.config()
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true , useUnifiedTopology: true},()=>{
    console.log("Mongodb Connected!!")
});

//middle-ware
app.use("/images",express.static(path.join(__dirname, "public/images")))

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage=multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    },
})

const upload =multer({storage});
app.post("/api/upload",upload.single('file'), (req,res)=>{
    try{
        return res.status(200).json("File uploaded successfully")
    }
    catch(err){
        console.log(err)
    }
})


app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);
app.use('/api/comments',commentRoute);

// app.get("/",(req,res)=>{
//     res.send("Welcome to the home page")
//
app.listen(3001,()=>{
    console.log("Backend Server is running ")
})