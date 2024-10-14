const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageToCloud}=require("../utils/imageUploader");

exports.createSubSection=async (req,res)=>{
    try{
        //fetch details from body
        const {sectionId,title,timeDuration,description}=req.body;
        //extract file/video
        const video=req.files.videoFile;
        //validate
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        console.log("checkpoint")
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloud(video,process.env.FOLDER_NAME);
        //create a subsection
        console.log("checkpoint2")
        const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        console.log("checkpoint2")
        //update section with this subsection object id
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{
                                                            $push:{
                                                                subSection:SubSectionDetails._id,
                                                            },},
                                                            {new:true}
                                                        )
        //HW: log updated section here. afer adding populate qurey

        return res.status(200).json({
            success:true,
            message:"Subsection Created Succesfuly",
            updatedSection
        })
        

        

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something went Wrong"
        })

    }
}
//Update Subsection

//Delete Subsection
