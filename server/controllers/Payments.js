const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const {instance}=require("../config/razorpay");
const Course=require("../models/Course")
const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const Razorpay = require("razorpay");
const mongoose = require("mongoose")
const crypto = require("crypto");
const { access } = require("fs/promises");
const { accessSync } = require("fs");
const CourseProgress=require("../models/CourseProgress")



//capture the paymetn and initiate the razorpay order

//multi order paymetn
//initialize order
exports.capturePayment=async( req, res)=>{
    const {courses} = req.body;
    const userId= req.user.id;
    console.log("capture payment cp 1")
    if(courses.length===0){
        return res.json({success:false, message:"Please Provide course id"})
    }
    let totalAmount=0

    for(const course_id of courses){
        let course;
        try{
            console.log("capture payment cp 2" ,courses.length)

            course=await Course.findById(course_id);
            console.log("capture payment cp 3",courses,course)

            if(!course){
                return res.status(200).json({success:false,message: "Could not find the course"})
            }
            const uid=new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false,message:"Already enrolled in the course"})
            }
            console.log("total price before",totalAmount)
            totalAmount=  totalAmount +course.price;
            console.log("total price after",totalAmount)

        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
    }

    const options={
        amount:totalAmount *100,
        currency:"INR",
        receipt:Math.random (Date.now()).toString()
    }

    try{
        const paymentResponse=await instance.orders.create(options);
        console.log("capture payment cp 5")

        return res.json({
            success:true,
            message:paymentResponse
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Could not initiate order"

        })}


    }
exports.verifyPayment=async(req,res)=>{
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const  razorpay_signature=req.body?.razorpay_signature;
    const courses=req.body.courses;
    console.log(req.body.courses);
    const userId=req.user.id;

    if(!razorpay_order_id || 
        !razorpay_payment_id ||
        !razorpay_signature || !courses ||
        !userId ){
            return res.status(200).json({
                success:false,
                message:"Payment fields"
            })  
        }
    let body = razorpay_order_id + "|" + razorpay_payment_id
    
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

    if(expectedSignature=== razorpay_signature){
        //enroll karwao student ko
         try{
            console.log("cp 1")
            await enrolledStudents(courses,userId,res)
            console.log("cp 2")

         }
         catch(err){
            console.log("cp 3")

            return res.status(400).json({
                success:false,
                message:"Payemnt Verified but unable to enroll"
            })
         }
         console.log("cp 4")

        //return respnse 
        return res.status(200).json({
            success:true,
            message:"Payemnt Verified"
        })

    }
    return res.status(500).json({ 
        success:false,
        message:"Payemnt Failed"
    })
}

const enrolledStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
    console.log("EC 1")
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        console.log("EC 2",courseId,typeof courseId)



        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
        console.log("EC 3",enrolledCourse)

        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }

exports.sendPaymentSuccessEmail=async(req,res)=>{
    const {orderId, paymentId,amount}=req.body;
    console.log("SPSE 1",req.user)
    const userId=req.user.id;
    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide all the fields"
        })
    }
    try{
        console.log("hiting enrolled")
        const enrolledStudent=await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount/100,
                orderId,
                paymentId
            )
        )
        console.log("SPSE 2")

    }
    catch(err){
        console.log("error in sendind mail",err)
        return res.status(500).json({success:false,message:"Could not send email"})
    }

}


// exports.capturePayment=async (req,res)=>{
//     try{
//         //get course id and user id
//         const {course_id} =req.body;
//         const userId=req.user.id;
//         //vlaidation
//         //valid couse id
//         if(!course_id){
//             return  res.status(400).json({
//                 success:false,
//                 message:"Please provide  valid course ID"
//             })
//         }
//         //calid course details
//         let course;
//         try{
//             course=await Course.findById(course_id)
//             if(!course){
//                 return  res.status(400).json({
//                     success:false,
//                     message:"Could nor find the course"
//                 })
//             }
//             //User already pay for the same course
//             const  uid= new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)){
//                 return  res.status(400).json({
//                     success:false,
//                     message:"Already Enrolled"
//                 })
//             }

//         }
//         catch(error){
//             console.error(error);
//             return  res.status(400).json({
//                 success:false,
//                 message:error.message
//             })

//         }
    
        
//         //order create
//         const amount=course.price;
//         const currency="INR";
//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now().toString()),
//             notes:{
//                 courseId:course_id,
//                 userId,
//             }
//         }
//         //initiate the payment using razorpay
//         try{
//             const paymentResponse=await instance.orders.create(options);
//             console.log(paymentResponse);
//             return  res.status(200).json({
//                 success:true,
//                 message:"Order Initiated",
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount,
//             })

//         }
//         catch(error){
//             return  res.status(400).json({
//                 success:false,
//                 message:"couldnot initiate order"
//             })

//         }
//     }
//     catch(error){
//         return  res.status(400).json({
//         success:false,
//         message:"Something Broke"
//     })

//     }
    
// }

// exports.verifySignature=async (req, res)=>{
//     const webhookSecret="12345678";
 
//     const signature=req.headers["x-razorpay-signature"];
//     const shasum=crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body))
//     const digest=shasum.digest("hex");
//     if(signature===digest){
//         console.log("Payment is authorized")

//         const {courseId,userId}=req.body.payload.payment.entity.notes;
//         try{
//             //fulfill the aciton
//             //find the couse and enroll the students in it
//             const enrolledCourse=await Course.findOneAndUpdate(
//                                                             {_id:courseId},
//                                                             {$push:{studentsenrolled:userId}},
//                                                             {new:true},
//                                                         )

//             if(!enrolledCourse){
//                 return  res.status(400).json({
//                     success:false,
//                     message:"Course not Found"
//                 })
//             }
//             console.log(enrolledCourse)

//             //find the student and add the course to thier list of enrolled courses
//             const enrolledStudent=await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},)
//             console.log(enrolledStudent);
//             ///send conformation email

//             const emailResponse=await mailSender(enrolledStudent.email,
//                                                 "Welcome to StudyNotion",
//                                                 "Congratulation You are on boarded to StudyNotion"
//             );
//             console.log(emailResponse);
//             return  res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course added "
//             }) 




//         }
//         catch(error){
//             return  res.status(400).json({
//                 success:false,
//                 message:"Something broke"
//             })
//         }

//     }
//     else{
//         return  res.status(400).json({
//             success:false,
//             message:"Invalid Request , Signature Not Verified"
//         })
//     }

// }