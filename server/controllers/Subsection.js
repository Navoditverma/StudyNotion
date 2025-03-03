const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageToCloud}=require("../utils/imageUploader");

exports.createSubSection=async (req,res)=>{
    try{
        //fetch details from body
        console.log("Reaching the controller ")
        const {sectionId,title,description}=req.body;
        //extract file/video
        const video=req.files.video;
        //validate
        console.log(sectionId, title,video,description)
        if(!sectionId || !title || !video || !description){
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
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
          })
        console.log("checkpoint2",SubSectionDetails)
        //update section with this subsection object id
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
          ).populate("subSection")
        //HW: log updated section here. afer adding populate qurey
        console.log(updatedSection)                                                    
        return res.status(200).json({
            success:true,
            message:"Subsection Created Succesfuly",
            data:updatedSection
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
exports.updateSubSection=async (req,res)=>{
    try{
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
        if (!subSection) {
            return res.status(404).json({
              success: false,
              message: "SubSection not found",
            })
          }
        if (title !== undefined) {
        subSection.title = title
        }
        if (description !== undefined) {
        subSection.description = description
        }      
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
          }
        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
          )
        console.log("updated section", updatedSection)
        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section",
        })
      }


}

//Delete Subsection
exports.deleteSubSection = async (req, res) => {
try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
        $pull: {
            subSection: subSectionId,
        },
        }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
        return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
    )

    return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
    })
    }
    catch (error) {
    console.error(error)
    return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
    })
    }
}

