const RatingAndReview=require("../models/RatingAndReview");
const Course= require("../models/Course");

//createrating

exports.createRating=async (req, res)=>{
    try{
        //data fetch
        const userId=req.user.id;
        //fetch data from req body
        const {rating , review, courseId}= req.body;
        // check if the iser is enrolled
        const courseDetails=await Course.findOne(
                                            {_id:courseId,
                                                studentsEnrolled:{$elemMatch:{$eq:userId}},

                                            })
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:"Student is not enrolled in the course",
                    error:error.message
                })
            }
        //check id user already give rating or not
        const alreadyReviewed=await RatingAndReview.findOne(
                                                {user:userId,
                                                course:courseId
                                                })
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Already rated for the course",
                error:error.message
            })
        }
        //crate review
        const ratingReview=await RatingAndReview.create(
                                        {
                                            rating, review,
                                            course:courseId,
                                            user:userId
                                        }

                            )
        //update course with rating. review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                            ratingAndReview:ratingReview._id,
                                            }
                                        },
                                        {new:true}
                                    
        )
        console.log(updatedCourseDetails)
        

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating And Review Succesfully ",
            ratingReview
        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"",
            error:error.message
        })
    }
}
//get avg rating

exports.getAverageRating=async (req,res)=>{
    try{
        //get course id
        const courseId=req.body.courseId;

        //cal avg rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg: "$rating"}
                }
            }
        ])

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })

        }
        //if no rating review exist
        return res.status(200).json({
            success:true,
            message:"No Ratings Found",
            averageRating: 0,

        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch course details",
            error:error.message
        })
    }

}
// get all rating

exports.getAllRating=async (req,res)=>{
    try{
        console.log("Reached backend ")
        const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
        console.log("Reached backend 1 ",allReviews)
                                
        return res.status(200).json({
            success:true,
            message:"All reviews fetched succesfully",
            data:allReviews,
        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch course details",
            error:error.message
        })
    }
}


//



