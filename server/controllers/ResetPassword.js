const User=require("../models/User")
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt")

//resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{

    try{
        console.log("working")
        //get email from req body
    const email=req.body.email;
    //check user for this email ,email verification
    const user=await User.findOne({email:email})
    if(!user){
        return res.json({
            success:false,
            message:"No Account Found using the Enterd Email"
        })

    }
    //generate token
    const token=crypto.randomUUID();
    ///update user by adding token and expiration time
    const updateDetails=await User.findOneAndUpdate({email:email},
                                                    {token:token,
                                                     resetPasswordExpires:Date.now() + 5*60*1000,
                                                    },
                                                    {new:true}
    )
    //create url
    const url=`http://localhost:300/update-password/${token}`;
    //send mail containing url
    await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`);
    //return response

    return res.json({
        success:true,
        message:"Email Sent Succesfully,Please Check your email"
    })

    }
    catch(error){
        return res.json({
            success:false,
            message:"Error Sending reset link"
        })
    }
}
//reset Password

exports.resetPassword=async(req,res)=>{
    try{
         //data fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"Password Mismatch"
        })
    }
    //get Userdetails
    const userdetails=await User.findOne({token:token});
    //if no entry - invalid token
    if(!userdetails){
        return res.json({
            success:false,
            message:"Invalid token"
        })
    }
    // check token time
    if(userdetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:"Token  expired"
        })

    }
    //password hashing
    const hashedPassword=await bcrypt.hash(password,10);
    //password update
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )
    return res.json({
        success:true,
        message:"Password Succesfully Changed"
    })

    }
    catch(error){
        return res.json({
            success:false,
            message:"Something Went Wrong While changing password"
        })
    }
   
}