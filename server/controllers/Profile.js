const Profile=require("../models/Profile")
const User=require("../models/User")
const { uploadImageToCloud} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")
const Course=require("../models/Course")

exports.updateProfile=async (req, res)=>{
    try{
        //get data
        const {displayName,contactNumber,gender,dateOfBirth="" ,about=""}=req.body;

        //User id
        const id=req.user.id;
        console.log(id);

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message: "Missing Fields"
            })
        }
        //Find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
        // update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        
        await profileDetails.save();
        

        //return response
        return res.status(200).json({
            success:true,
            message: "Profile Succesfully updated",
            profileDetails
        })
        


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message: "Something Went Wrong"
        })

    }
}

//Delete Account

exports.deleteProfile=async (req,res)=>{
    try{
        const id= req.user.id;
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message: "User not Found with given ids"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})

        //delete user
        await User.findByIdAndDelete({_id:id});

        //HW Unenroll use from all enrolled courses
        //return response
        return res.status(200).json({
            success:true,
            message: "Profile Succesfully Deleted"
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message: "Something Went Wrong"
        })

    }
}

exports.getAllDetails=async( req, res)=>{
    try{
        //getid
        //get user details And valdation
        
        const id=req.user.id;
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message: "User Data Succesfully Fetched",
            data:userDetails
        })
        
  }
    catch(error){
        return res.status(400).json({
            success:false,
            message: "Something Went Wrong"
        })

    }
} 

//Update Display Profile

exports.updateDisplayPicture=async( req, res)=>{
    try{

        const displayPicture = req.files.displayPicture
        const userId=req.user.id;
        const image= await uploadImageToCloud(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile= await User.findByIdAndUpdate( 
            { _id: userId },
            { image: image.secure_url },
            { new: true })
        console.log(updatedProfile)
        return res.status(200).json({
            success:true,
            message:"Profile Picture Succesfully updated",
            data: updatedProfile,
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
          })
    }
   

}

exports.getEnrolledCourses = async (req, res) => {
    try {
        console.log("gec CP 1")
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                path: "subSection",
                },
            },
            })
            .exec()
        console.log("gec CP 2",userDetails)

        userDetails = userDetails.toObject()
        console.log("gec CP 3",userDetails, userDetails.courses?.length)

        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            console.log("gec CP 4",i)

            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                console.log("gec CP 4.1",j)

            totalDurationInSeconds += userDetails.courses[i].courseContent[
                j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
                totalDurationInSeconds
            )
            SubsectionLength +=
                userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
            } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
                Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
                ) / multiplier
            }

        }

    
        if (!userDetails) {
            return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
        } 
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
}

exports.instructorDashboard= async (req, res)=>{
    try{
        console.log("CP 1")
        const courseDetails= await Course.find({instructor:req.user.id});
        console.log("CP 2")

        const courseData=courseDetails.map((course)=>{
            const totalStudentsEnrolled=course.studentsEnrolled.length;
            const totalAmountGenerated=totalStudentsEnrolled * course.price;

            //create and new object with additional fields
            const couresDataWithStats={
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
                
            }
            return couresDataWithStats;
        })
        console.log("CP 3")

        res.status(200).json({
            success:true,
            courses:courseData
        })
        

    }
    catch(err){
        console.error(err);
        res.status(500).json(
            {
                success:false,
                message:"error in Instructor dashboard function"
                
            }
        )
    }
}