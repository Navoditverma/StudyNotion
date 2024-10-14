const {instance}=require("../config/razorpay");
const Course=require("../models/Course")
const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail")

//capture the paymetn and initiate the razorpay order

exports.capturePayment=async (req,res)=>{
    try{
        //get course id and user id
        const {course_id} =req.body;
        const userId=req.user.id;
        //vlaidation
        //valid couse id
        if(!course_id){
            return  res.status(400).json({
                success:false,
                message:"Please provide  valid course ID"
            })
        }
        //calid course details
        let course;
        try{
            course=await Course.findById(course_id)
            if(!course){
                return  res.status(400).json({
                    success:false,
                    message:"Could nor find the course"
                })
            }
            //User already pay for the same course
            const  uid= new mongoose.Types.ObjectId(userId);
            if(course.studentsenrolled.includes(uid)){
                return  res.status(400).json({
                    success:false,
                    message:"Already Enrolled"
                })
            }

        }
        catch(error){
            console.error(error);
            return  res.status(400).json({
                success:false,
                message:error.message
            })

        }
    
        
        //order create
        const amount=course.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now().toString()),
            notes:{
                courseId:course_id,
                userId,
            }
        }
        //initiate the payment using razorpay
        try{
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);
            return  res.status(200).json({
                success:true,
                message:"Order Initiated",
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            })

        }
        catch(error){
            return  res.status(400).json({
                success:false,
                message:"couldnot initiate order"
            })

        }
    }
    catch(error){
        return  res.status(400).json({
        success:false,
        message:"Something Broke"
    })

    }
    
}

exports.verifySignature=async (req, res)=>{
    const webhookSecret="12345678";

    const signature=req.headers["x-razorpay-signature"];
    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest("hex");
    if(signature===digest){
        console.log("Payment is authorized")

        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try{
            //fulfill the aciton
            //find the couse and enroll the students in it
            const enrolledCourse=await Course.findOneAndUpdate(
                                                            {_id:courseId},
                                                            {$push:{studentsenrolled:userId}},
                                                            {new:true},
                                                        )

            if(!enrolledCourse){
                return  res.status(400).json({
                    success:false,
                    message:"Course not Found"
                })
            }
            console.log(enrolledCourse)

            //find the student and add the course to thier list of enrolled courses
            const enrolledStudent=await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$push:{courses:courseId}},
                                                {new:true},)
            console.log(enrolledStudent);
            ///send conformation email

            const emailResponse=await mailSender(enrolledStudent.email,
                                                "Welcome to StudyNotion",
                                                "Congratulation You are on boarded to StudyNotion"
            );
            console.log(emailResponse);
            return  res.status(200).json({
                success:true,
                message:"Signature verified and course added "
            }) 




        }
        catch(error){
            return  res.status(400).json({
                success:false,
                message:"Something broke"
            })
        }

    }
    else{
        return  res.status(400).json({
            success:false,
            message:"Invalid Request , Signature Not Verified"
        })
    }

}