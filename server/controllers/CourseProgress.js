const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress= async(req,res)=>{
    const {courseId,subSectionId}=req.body;
    const userId=req.user.id;
    

    try{
        const subSection=await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(400).json({
                success:false,
                message:"invalid subsection"
            })
        }
        let courseProgress=await CourseProgress.findOne({
            courseID:courseId,
            userId:userId,
            }
        )
        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"Course P does not exist"
            })
        }
        else{
            //check for recompleting video or subsectino 

            if(courseProgress?.completedVideos?.includes(subSectionId)){
                return res.status(404).json({
                    success:false,
                    message:"SubSection Alredy Completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId);
            await courseProgress.save();
            return res.status(200).json({
                success:true,
                message:"Course Progrss updated succesfully"
            })
        }

    }
    catch(error){
        console.log(error);
        


    }
}