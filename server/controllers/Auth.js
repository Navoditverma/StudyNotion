const User=require("../models/User")
const OTP=require("../models/Otp")
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const mailSender=require("../utils/mailSender")
require("dotenv").config();
const sendVerificationEmail=require("../models/Otp")
const Profile=require("../models/Profile");
const { default: mongoose } = require("mongoose");




//sendOTP

exports.sendOTP= async (req,res)=>{
    try{
    //Fetch Emial
    const {email}=req.body;
    //check user exist or not
    const checkUserPresent=await User.findOne({email});


    //ifUser exist then returrn aresponse
    if(checkUserPresent){
        res.status(401).json({
            succcess:false,
            message:"user already registered"
        })
    }
    //genrate otp
    let otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("generated otp:"+otp);

    //check otp uniquenesss
    const result=await OTP.findOne({otp: otp});
    while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        const result=await OTP.findOne({otp: otp});
    }
   

    const otpPayLoad={  email,otp };
    console.log("checkpoint 0")
    //create an entry in db for otp
    const otpBody=await OTP.create({email,otp});
    console.log(otpBody);
 


    res.status(200).json({
        success:true,
        message:"Otp Send Succesfully",
        otp,
    })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            
            message:"Error sending Otp"
        })
    }

}

//SignUP 
exports.signUp=async (req,res)=>{
    try{
        //data fetch from req body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,}= req.body

    //validate data
    console.log(firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber)
    if(!firstName || !lastName || !email || !confirmPassword || !password  || !otp){
        return res.status(400).json({
            success:false,
            message:"All fields Are required"
        })
    }
    //2 password match karlo
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Both Passwords Didnt Match"
        })

    }
    //check user already exist or not
    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User Already Exist with the registered email"
        })
    }

    //find most recent OTP stores for the user
    console.log("hy1")

    const recent=await OTP.find({email}).sort({createdAt:-1}).limit(1);
   
    const recentOtp=recent[0].otp;
 
    //validate OTP
    if(recentOtp.length===0){
        return res.status(400).json({
            success:false,
            message:"Error Fetching OTP"
        })
    }else if(otp !== recentOtp){
        return res.status(403).json({
            success:false,
            message:"Incorrect OTP"
        })
    }
    
    //Hash Password

    const hashedPassword= await bcrypt.hash(password,10)
    

    //Create db entry
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });
   
   
    console.log("checkpointBefore")

    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType:accountType,
        additionalDetails: profileDetails._id,
        image:`https:/api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    



    
    console.log("checkpointAfter")
    //return res
    return res.status(200).json({
        success:true,
        message:" User Succesfully Registered",
        user
    })
    }
    catch(err){
        return res.status(200).json({
            success:false,
            message:" Error Creating account ! Try Again Later",
            
        })

    }
}

//LOGIN

exports.login= async(req, res)=>{
    try{
        //get Data from req body
        const {email,password}=req.body;
        //Validation Data
        if(!email || !password ){
            return res.status(402).json({
                success:false,
                message:"Enter All the required fields"
            })
        }
        //User check exsist or not
        const user= await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found With the Registered Email"
            })
        }
        //generate JWt, after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token
            user.password=undefined;
        
        //create cookie
        const options={
            expires:new Date(Date.now()+ 3*24*60*60*1000)
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"logged in succesfully"

        })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            })
        }

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error Login ! Try Again later"
        })

    }
}
exports.changePassword= async(req, res)=>{
    try{
        //fetch email and password from the body
        const {email, oldPassword,newPassword,confirmPassword}=req.body;
        //validate the details
        const userDetails= await User.findone({email})
        if(!userDetails){
            return  res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        if(bcrypt.compare(oldPassword,userDetails.password)){
            if(newPassword!==confirmPassword){
                return res.status(401).json({
                    success:false,
                    message:"New passwords didnt match"
                })
            }
            const newHasshedPassword= await bcrypt.hash(newPassword,10);
            await User.findOne({email}).update({password:newHasshedPassword})
            //Send Mail
            const body=`<h2>Password Succesfully changed on the StudyNotion for this email  at ${Date.now()}</h2>`
            mailSender(email,"Password Succesfully Changed",body)

            //return response

            return res.status(200).json({
                success:true,
                message:"Password Successfully changed"
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            })
        }


    }
    catch(err){

    }
}

