const Category=require("../models/Category")
//create Category Handler Function;

exports.createCategory= async (req,res)=>{
    try{
        const {name , description}= req.body;
        if(!name || !description){
            return res.status(500).json({
                success:false,
                message:"All fields are required",
            })
        }
        
        //create a entry in db
        console.log("reached db creation")
        const categoryDetails= await Category.create({
            name:name,
            description:description,
        })
        console.log(categoryDetails);
        return res.status(200).json({
            success:true,
            message:"Category created succesfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}

///Get all Category

exports.showAllCategories=async (req,res)=>{
    try{
        const allCategory=await Category.find({},{name:true,description:true})
        res.status(200).json({
            success:true,
            message:"All Category returned succesfully",
            allCategory
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }

}

exports.categoryPageDetails=async(req, res)=>{
    try{
        //get category id
        const {categoryId}= req.body;
        // get courses for spcidied category id
        const selectedCategory=await Category.findById(categoryId)
                                                        .populate("courses")
                                                        .exec()
        
        //validation
        if(!selectedCategory){
            return res.status(400).json({
                success:false,
                message:"Data Not Found",
                error:error.message
            })
        }
        //get courses. for different categoies
        const  differentCategories=await Category.find(
                                                    {_id:{$ne:categoryId},
                                                })
        //get top selling courses

        // return response
        return res.status(200).json({
            success:true,
            
            data:{
                selectedCategory,
                differentCategories
            }
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