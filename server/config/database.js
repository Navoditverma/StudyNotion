const mongoose=require("mongoose");

require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        
    })
    .then(console.log("DB Succesfully Connected"))
    .catch((error)=>{
        console.error(error);
        console.log("Issue with DB Connection"+ error)
        process.exit(1);
    })

}