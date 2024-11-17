import React, { useEffect, useState } from 'react'
import { Form, set, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import {addCourseDetails, editCourseDetails, fetchCourseCategories} from "../../../../../services/operations/courseAPI"
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementField from './RequirementField';
import IconBtn from "../../../../common/IconBtn"
import toast from 'react-hot-toast';
import { setCourse , setStep} from "../../../../../slices/courseSlice"
import {COURSE_STATUS} from "../../../../../utils/constants"
import ChipInput from './ChipInput';
import Upload from '../Upload';


  const CourseInformationForm = () => {
  const {token}= useSelector((state)=> state.auth)

  const {  
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors},

  }=useForm();
  // const {step,setStep}= useSelector((state)=>state.course)


  const dispatch=useDispatch();
  const {course,editCourse} =useSelector((state)=> state.course)
  const [ loading,setLoading]=useState(false);
  const [courseCategories,setCourseCategories]=useState([]);

  useEffect(()=>{
    const getCategories=async()=>{
      setLoading(true)
      const categories=await fetchCourseCategories();
      if(categories.length>0){
        setCourseCategories(categories);
      }
      setLoading(false);
    } 
    if(editCourse){
      setValue("courseTitle",course.courseName);
      setValue("courseShortDesc",course.courseDescription);
      setValue("coursePrice",course.price);
      setValue("courseTags",course.tag);
      setValue("courseBenefits",course.whatYouWillLearn);
      setValue("courseCategory",course.category);
      setValue("courseRequirements",course.instructions);
      setValue("courseImage",course.thumbnail);


    } 
    getCategories();
  },[])
  const isFormUpdated=()=>{
    const currentValues=getValues();
    console.log("id:",currentValues.courseCategory._id)
    if(currentValues.courseTitle!==course.courseName ||
        currentValues.courseShortDesc!==course.courseDescription ||
        currentValues.coursePrice!== course.price ||
        currentValues.courseTags.toString() !==course.tags.toString() ||
        currentValues.courseCategory!==course.courseCategory._id ||
        currentValues.courseBenfits!==course.whatYouWillLearn ||
        currentValues.courseImage!==course.thumbnail||
        currentValues.courseRequirements.toString()!==course.instructions.toString()||
        currentValues.courseImage !== course.thumbnail

    ){
      return true;
    }
    else return false;
  }

  const onSumbit=async(data)=>{
    if(editCourse){
      if(isFormUpdated()){
        const currentValues=getValues();
        const formData=new FormData();
        formData.append("courseId",course._id);
        if(currentValues.courseTitle!==course.courseName){
          formData.append("courseName",data.courseTitle)
        }
        if(currentValues.courseShortDesc!==course.courseDescription){
          formData.append("courseDescription",data.courseShortDesc)
        }
        if(currentValues.coursePrice!==course.price){
          formData.append("coursePrice",data.coursePrice)
        }
        if(currentValues.courseBenfits!==course.whatYouWillLearn){
          formData.append("whatYouWillLearn",data.courseBenfits)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if(currentValues.courseCategory._id!==course.category._id){
          formData.append("category",data.courseCategory)
        }
        if(currentValues.courseRequirements!==course.instructions.toString()){
          formData.append("instructions",JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
      
        setLoading(true)
        const result=await editCourseDetails(formData,token);
        setLoading(false)
        if(result){
          dispatch(setStep(2));
          dispatch(setCourse(result))
        }
      
      }
      else{
        toast.error("No changes made to the form")
      }   
      return;   
    }
    const formData=new FormData();
    console.log("id",data.courseCategory)
    formData.append("courseName",data.courseTitle)
    formData.append("courseDescription",data.courseShortDesc)
    formData.append("coursePrice",data.coursePrice)
    formData.append("whatYouWillLearn",data.courseBenefits)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("category",data.courseCategory)
    formData.append("instructions",JSON.stringify(data.courseRequirements))
    formData.append("status",COURSE_STATUS.DRAFT);
    formData.append("thumbnailImage", data.courseImage)


    setLoading(true);
    console.log("formdata before");
    formData.forEach((value, key) => {
      console.log(key, value);
  });
    const result=await addCourseDetails(formData,token)
    if(result){
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
    console.log("Printing set Loading ",formData)
    console.log("Printing result ",result)
  }

  return (
    <form
      onSubmit={handleSubmit(onSumbit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">

        <label className="text-sm text-richblack-5"  htmlFor='courseTitle'>Course Title <sup>*</sup></label>
        <input
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle",{required:true})}
          className="form-style w-full"
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required**</span>
          )
        }
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseShortDesc'>Course Short Description <sup>*</sup></label>
        <textarea
          id='courseShortDesc'
          placeholder='Enter Course Description'
          {...register("courseShortDesc",{required:true})}
           className="form-style resize-x-none min-h-[130px] w-full"
        />
        {
          errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is Required**</span>
          )
        }
      </div>

      <div className="flex flex-col space-y-2">
        <label  className="text-sm text-richblack-5"  htmlFor='coursePrice'>Course Price <sup>*</sup></label>
        <div className="relative">
          <input
            id='coursePrice'
            placeholder='Enter Course Price'
            {...register("coursePrice",{
                required:true,
                valueAsNumber:true,
                pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
              })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400"/>

        </div>
        
        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required**</span>
          )
        }
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseCategory'>Course Category 
        <sup className="text-pink-200">*</sup></label>
        <select
          id='courseCategory'
          defaultValue=""
          placeholder='Enter Course Category'
          {...register("courseCategory",{required:true})}
          className="form-style w-full"
        >
          <option value="" disabled>Choose a Category</option>
          {
            !loading && courseCategories.map((category,index)=>(
                <option key={index} value={category?._id}>{category?.name}</option>
            ))
          }
        </select>
        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required</span>
          )
        }
      </div>

      {/* Tags Component */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Component for uplaoding adn shoring previwe of media */}
      <Upload
         name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefit of the course */}
      <div  className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5"> Benefits of the course
        <sup className="text-pink-200">*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the Course'
          {...register("courseBenefits",{required:true})}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {
          errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Benefits of the course are required
            </span>
          )
        }
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      
      <div className="flex justify-end gap-x-2">
        {
          editCourse && (
            <button
            onClick={()=>dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
                Continue wihtout saving
            </button>
          )
        }

        <IconBtn
          text={!editCourse ? "Next" :"Save Changes"}
          
        />

      </div>



    </form>
  )
}

export default CourseInformationForm