const Category=require("../models/Category")
//create Category Handler Function;
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
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

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails=async(req, res)=>{
    try{
        //get category id
        const {categoryId}= req.body;
        console.log("checkpoooint",categoryId)
        // get courses for spcidied category id
        const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
        
        console.log("checkpoint1",selectedCategory)

        //validation
        if(!selectedCategory){
            return res.status(400).json({
                success:false,
                message:"Data Not Found",
                error:error.message
            })
        }
        console.log("checkpoint2")

        //get courses. for different categoies
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
          })
          console.log("categoriesExceptSelected",categoriesExceptSelected)
  
        let differentCategory = await Category.findOne(
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                    ._id
                )
                .populate({
                    path: "courses",
                    match: { status: "Published" },
                })
                .exec()
                console.log("differentCategory",differentCategory)
        const allCategories = await Category.find()
                .populate({
                  path: "courses",
                  match: { status: "Published" },
                  populate: {
                    path: "instructor",
                },
                })
                .exec()
                console.log("allCategoris",allCategories)

        const allCourses = allCategories.flatMap((category) => category.courses)
        console.log("allCourses",allCourses)
        
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        console.log("mostSellingCourses COURSE", mostSellingCourses)
        return res.status(200).json({
            success: true,
            message:"Ab Dekho malik",
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses
            },
            })


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Failed to fetch course details",
            error:error.message
        })
    }

}