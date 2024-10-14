const Profile=require("../models/Profile")
const User=require("../models/User")
const { uploadImageToCloud} = require("../utils/imageUploader");


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