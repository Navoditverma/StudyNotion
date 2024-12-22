const mongoose=require("mongoose");

const courseProgess=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    completedVideo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
        
    }]
})
module.exports=mongoose.model("courseProgess",courseProgess)