const nodemailer=require("nodemailer");
const otpTemplate=require("../mail/templates/emailVerificationTemplate")

const mailSender= async (email,title ,otp) =>{
    try{
        const body=otpTemplate(otp);
        let tranporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        let info=await tranporter.sendMail({
            from: 'StudyNotion || AlphaCoders',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
         })
        console.log(info);
        return info;
 
    }
    catch(err){
        console.error(err);
        console.log(err)

    }
}
module.exports=mailSender;