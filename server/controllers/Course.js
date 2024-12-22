const { populate } = require("dotenv");
const Course=require("../models/Course")
const Category=require("../models/Category")
const User=require("../models/User")  
const {uploadImageToCloud}=require("../utils/imageUploader") ;
const Section=require("../models/Section")
const SubSection=require("../models/SubSection")

//createCourese Handler

exports.createCourse= async ( req,res)=>{
    try{
        //Fetvch Datakjkjjk
        console.log("Reached hereasdfars")
        const userId = req.user.id
        let {
          courseName,
          courseDescription,
          whatYouWillLearn,
          coursePrice,
          tag: _tag,
          category,
          status,
          instructions: _instructions,
        } = req.body
        
        // get Thumbnail;
        const thumbnail=req.files.thumbnailImage;
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        //validation 
        console.log(courseName,courseDescription,coursePrice,whatYouWillLearn,tag,thumbnail,category,"checkpoooooint")
        
        if(
          !courseName 
          || !courseDescription 
          || !coursePrice 
          || !whatYouWillLearn 
          || !tag 
          ||!thumbnail 
          || !instructions.length
          || !category){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }
        if (!status || status === undefined) {
          status = "Draft"
        }
        console.log("Reached 2")

        //check for Validation
        console.log(userId)
        const instructorDetails = await User.findById(userId, {
			                                    accountType: "Instructor",
		                                      });
        console.log("Instructor Details:",instructorDetails);



        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details are not found"
            })
        }
        console.log("Reached 3")

        //check given tag is valid or ont
        console.log("category:",category)

        const categoryDetails = await Category.findById(category);
        console.log(categoryDetails)
        if (!categoryDetails) {
          return res.status(404).json({ 
            success: false,
            message: "Category Details Not Found",
          });
        }
        console.log("Reached 4")
        
        //Upload Image to cloudinary
        const thumbnailImgage=await uploadImageToCloud(thumbnail,process.env.FOLDER_NAME)

        //create an entry for new course
        console.log("Reached 5" + instructorDetails._id)
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price:coursePrice,
            tag:tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImgage.secure_url,
            status: status,
            instructions,
        })

        
       

        
        console.log("Reached 6" + newCourse._id)
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )
        console.log("Reached 7")
        await Category.findByIdAndUpdate(
          { _id: category },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        );
        

        //upadte the tag ka schema HW

        //return response
        return res.status(200).json({
            success:true,
            data:newCourse,
            message:"Course Added Succesfullyy"
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        })

    }
}


//get all course handler function

exports.getAllCourses=async (req, res)=>{
    try{
        const allCourses=await Course.find({},{courseName:true,
                                            coursePrice:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingAndReviews:true,
                                            studentsEnrolled:true,})
                                            .populate("instructor")
                                            .exec();

        return res.status(200).json({
                success:true,
                message:"Data for all course fetched succesfully",
                data:allCourses
            })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch courses",
            error:error.message
        })
    }
}

//getCourse DEtails

exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
//edit course
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloud(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // let courseProgressCount = await CourseProgress.findOne({
    //   courseID: courseId,
    //   userId: userId,
    // })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // let totalDurationInSeconds = 0
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {courseDetails}
        // courseDetails,
        // totalDuration,
      //   completedVideos: courseProgressCount?.completedVideos
      //     ? courseProgressCount?.completedVideos
      //     : [],
      // },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    console.log("Check point 1")
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}