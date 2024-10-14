const Section=require("../models/Section");
const Course=require("../models/Course");


exports.createSection=async (req, res)=>{
    try{
        //data Fetch
        const {sectionName,courseId}=req.body;
        //DataValidation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Missing Fields"
            })
        }
        //create Section
        const newSection=await Section.create({sectionName});
        //push section object id in course
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent:newSection._id,
                                                    }
                                                },
                                                {new:true},//HW: use populatae to replace sectin and subsection both in the updated coutse
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Section Succesfully Created",
            updatedCourseDetails,
        })



    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something Went Wrong"
        })

    }
}
exports.updateSection= async (req,res)=>{
    try{
        //Data Inputs
        console.log("CheckPOint");
        const {sectionName,sectionId}=req.body;

        //Data Validations
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Fields"
            })
        }
        //UPdate Data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        console.log("CheckPOint1");

        //return response
        return res.status(200).json({
            success:true,
            message:"Section Updated Succesfully",
            section,
        })



    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something Went Wrong"
        })

    }
}

exports.deleteSection=async (req,res)=>{
    try{
        const {sectionId}=req.body;
        console.log(sectionId)
        await Section.findByIdAndDelete(sectionId);
        //todo do we need to delete the entry from the course schema  "will do in testing"
        console.log("checkpoint")
        return res.status(200).json({
            success:true,
            message:"Section Deleted Succesfully"
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something Went Wrong"
        })

    }
}