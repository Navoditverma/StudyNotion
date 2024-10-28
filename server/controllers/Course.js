const { populate } = require("dotenv");
const Course=require("../models/Course")
const Category=require("../models/Category")
const User=require("../models/User")  
const {uploadImageToCloud}=require("../utils/imageUploader") ;

//createCourese Handler

exports.createCourse= async ( req,res)=>{
    try{
        //Fetvch Datakjkjjk
        console.log("Reached hereasdfars")
        const {courseName,courseDescription,whatYouWillLearn,coursePrice,
            // tag,
            category}= req.body;

        //get Thumbnail;
        // const thumbnail=req.files.thumbnailImage;

        //validation
        console.log(courseName,courseDescription,coursePrice,whatYouWillLearn,category,"checkpoooooint")
        
        if(!courseName || !courseDescription || !coursePrice || !whatYouWillLearn || 
        //     !tag ||!thumbnail ||
			!category){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }
        console.log("Reached 2")

        //check for Validation
        const userId=req.user.id;
        console.log(userId)
        const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});
        console.log("Instructor Details:",instructorDetails);



        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details are not found"
            })
        }
        console.log("Reached 3")

        //check given tag is valid or ont
        console.log("category:",category)

        const categoryDetails = await Category.findById(category);
        console.log(categoryDetails)
		if (!categoryDetails) {
			return res.status(404).json({ 
				success: false,
				message: "Category Details Not Found",
			});
		}
        console.log("Reached 4")
        
        //Upload Image to cloudinary
        // const thumbnailImgage=await uploadImageToCloud(thumbnail,process.env.FOLDER_NAME)

        //create an entry for new course
        console.log("Reached 5" + instructorDetails._id)
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            coursePrice,
            // tag:tag,
            category: categoryDetails._id,
            // thumbnail:thumbnailImgage.secure_url,
        })

        
       

        
        console.log("Reached 6" + newCourse._id)
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )
        console.log("Reached 7")
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
        

        //upadte the tag ka schema HW

        //return response
        return res.status(200).json({
            success:true,
            data:newCourse,
            message:"Course Added Succesfullyy"
        })
        





    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        })

    }
}


//get all course handler function

exports.getAllCourses=async (req, res)=>{
    try{
        const allCourses=await Course.find({},{courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingAndReviews:true,
                                            studentsEnrolled:true,})
                                            .populate("instructor")
                                            .exec();

        return res.status(200).json({
                success:true,
                message:"Data for all course fetched succesfully",
                data:allCourses
            })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch courses",
            error:error.message
        })
    }
}

//getCourse DEtails

exports.getCourseDetails=async (req,res)=>{
    try{
        //get id
        const{ courseId}=req.body;
        //find course details
        const courseDetails=await Course.find(
                                            {_id:courseId}
                                            ).populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                }
                                            })
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .exec();
                //validation
                if(!courseDetails){
                    return res.status(400).json({
                        success:false,
                        message:`Could not find course with the following course id ${courseId}`,
                        error:error.message
                    })
                    
                }
                return res.status(200).json({
                    success:true,
                    message:"Details Succesfully Fetched",
                    data:courseDetails,
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
