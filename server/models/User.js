const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        
    }, 
    accountType:{
        type:String,
        enum:["Admin","Instructor","Student"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Profile'
    },
    courses:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Course"
    },
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String

    },
    resetPasswordExpires:{
        type:Date
    
    },
    courseProgess:[
        {  type:mongoose.Schema.ObjectId,
           ref:"courseProgess"}
        ]
    
})
module.exports=mongoose.model("User",userSchema)