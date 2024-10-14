const mongoose=require("mongoose")
const mailSender=require("../utils/mailSender")


const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

//Function to send verification mail
async  function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"Verfication Email From StudyNotion",otp);
        console.log("email sent succesfully",mailResponse);


    }
    catch(err){
        console.error(err);
        console.log("Error in Sending Otp ", err)
    }
}

    OTPSchema.pre("save",async function(next){
        console.log("sending mail")
        await sendVerificationEmail(this.email,this.otp);
        next();
    })
    




module.exports=mongoose.model("OTP",OTPSchema)