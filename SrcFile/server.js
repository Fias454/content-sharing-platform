const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const app = express();
const port = 5000;
//
app.use(express.json());
app.use(session({
    secret:"SA D WQD QWD WQ",
    resave: true,
    saveUninitialized: false
}));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
mongoose.connect("mongodb://localhost:27017/THiSSHiwqewqt")
.then(()=>console.log("Connected")).catch((err)=>console.error(err));
const storage = multer.diskStorage({
    filename:(req,file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    },
    destination:(req,file,cb)=>{
        cb(null, "./Files");
    }
});
const upload = multer({
    storage: storage,
    limits:{fileSize: 5*1024*1024},
    fileFilter:(req,file,cb)=>{
        const fileType = /jpeg|png|jpg/;
        const fileName = fileType.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileType.test(file.mimetype);
        if(fileName && mimeType){
            cb(null, true);
        }
    }
});
//
const userSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    name:{
        type:String
    },
    userPassword:{
        type:String
    }
});
const subSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    subPic:{
        type:String
    },
    titleValue:{
        type:String
    },
    disValue:{
        type:String
    }
});
const sub = mongoose.model("sub", subSchema);
const user = mongoose.model("user", userSchema);
//
app.post("/LogIn", async(req,res)=>{
    const {name, userName, password} = req.body;
    try{
        const isUserName = await user.findOne({userName: userName});
        if(isUserName){
            const isName = await user.findOne({name: name});
            if(isName){
                const isPassword = await bcrypt.compare(password, isName.userPassword);
                if(isPassword){
                    req.session.currentUser = isName.userId;
                    res.json({success:true});
                }else{
                    res.json({success:false});
                }
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/SignUp", async(req,res)=>{
    const {name, userName, password} = req.body;
    try{
        const isUserName = await user.findOne({userName: userName});
        if(!isUserName){
            const isName = await user.findOne({name: name});
            if(!isName){
                let UserDynDoc = `UserDocName:${userName}`;
                const hashedPassword = await bcrypt.hash(password, 12);
                const userId = await bcrypt.hash(name, 3);
                UserDynDoc = new user({
                    userId: userId,
                    userName: userName,
                    name:name,
                    userPassword: hashedPassword
                });
                await UserDynDoc.save();
                res.json({success:true});
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/Submit", upload.single("img"),async(req,res)=>{
    const {title, dis} = req.body;
    const img = req.file;
    try{
        if(req.session.currentUser){
            let DynSubName = `DynSubName:${title}`;
            DynSubName = new sub({
                userId: req.session.currentUser,
                subPic: img.path.replace(/\\+/g, "/"),
                titleValue:title,
                disValue:dis
            })
            await DynSubName.save();
            res.json({success:true});
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.get("/Nest", async(req,res)=>{
    try{
        const items = await sub.find();
        if(items){
            res.json(items);
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/setNest", async(req,res)=>{
    const {titleValue} = req.body;
    try{
        if(titleValue){
            const isTitle = await sub.findOne({titleValue: titleValue});
            if(isTitle){
                req.session.currentPost = isTitle.titleValue;
                res.json({success:true});
            }else{
                res.json({success:false});
            }
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/NestPost", async(req,res)=>{
    try{
        if(req.session.currentPost){
            const proDoc = await sub.findOne({titleValue: req.session.currentPost});
            if(proDoc){
                res.json({success:true, data: proDoc});
            }else{
                res.json({success:false});
            }
        }else{
            res.json({success:false});
        }
    }catch(err){
        console.error(err);
    }
});
app.post("/NestPostUserPoster", async(req,res)=>{
    try{
        if(req.session.currentPost){
            const isPro = await sub.findOne({titleValue: req.session.currentPost});
            if(isPro){
                const userId = await user.findOne({userId: isPro.userId});
                if(userId){
                    res.json({success:true, data:userId.userName});
                }else{
                    res.json({success:false});
                }
            }else{
                res.json({success:false});
            }
        }
    }catch(err){
        console.error(err);
    }
});
//
app.use("/PostImg/Files/", express.static(path.join(__dirname, "./Files")));
//
app.listen(port, (err)=>{
    (err)?console.error(err):console.log("server up and running");
});