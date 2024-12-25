const jwt=require("jsonwebtoken");


require("dotenv").config();


//auth

exports.auth=async (req,res,next)=>{
    try{
        const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        //if token missing then return response
        console.log("Token in middleware:",token)
        if(!token){
            return res.status(405).json({
                success:false,
                message:"Token is missing"
            })
        }

        //verify the token
        try{
            console.log("reached token verification")
            const decode=  await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
            console.log("cookie verified")
        }
        catch(err){
            return res.status(405).json({
                success:false,
                message:err.message
            })
        }
        next();

    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        })

    }
}
//isStudent

exports.isStudent=async (req, res ,next)=>{

    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only"
            })
        }
        console.log("student hai")
        next();

    }
    catch(error){
        return res.status(400).json({
            success:true,
            message:"User Role cannot be verified, pls try again"
        })
    }
}




//isInstructor
exports.isInstructor=async (req, res ,next)=>{

    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
        }
        next();

    }
    catch(error){
        return res.status(400).json({
            success:true,
            message:"User Role cannot be verified, pls try again"
        })
    }
}

//isAdmin
exports.isAdmin=async (req, res ,next)=>{

    try{
        console.log(req.user.accountType)
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next();
        

    }
    catch(error){
        return res.status(400).json({
            success:true,
            message:"User Role cannot be verified, pls try again"
        })
    }
}