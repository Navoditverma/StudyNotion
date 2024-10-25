import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import {fetchCourseCategories} from "../../../../../services/operations/courseAPI"
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import RequirementField from './RequirementField';

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors},

  }=useForm();

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

  const onSumbit=async(data)=>{

  }

  return (
    <form
      onSubmit={handleSubmit(onSumbit)}
      className=' rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8'
    >
      <div>
        <label htmlFor='courseTitle'>Course Title <sup>*</sup></label>
        <input
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle",{required:true})}
          className='w-full '
        />
        {
          errors.courseTitle && (
            <span>Course Title is Required**</span>
          )
        }
      </div>
      <div>
        <label htmlFor='courseShortDesc'>Course Short Description <sup>*</sup></label>
        <input
          id='courseShortDesc'
          placeholder='Enter Course Description'
          {...register("courseShortDesc",{required:true})}
          className='min-h-[140px] w-full '
        />
        {
          errors.courseShortDesc && (
            <span>Course Description is Required**</span>
          )
        }
      </div>

      <div className='relative '>
        <label htmlFor='coursePrice'>Course Price <sup>*</sup></label>
        <input
          id='coursePrice'
          placeholder='Enter Course Price'
          {...register("coursePrice",{
               required:true,
               valueAsNumber:true,
            })}
          className='w-full '
        />
        <HiOutlineCurrencyRupee className='absolute top-1/2  text-richblack-500'/>
        {
          errors.coursePrice && (
            <span>Course Price is Required**</span>
          )
        }
      </div>
      <div>
        <label htmlFor='courseCategory'>Course Category <sup>*</sup></label>
        <select
          id='courseCategory'
          defaultValue=""
          placeholder='Enter Course Category'
          {...register("courseCategory",{required:true})}
          className='w-full '
        >
          <option value="" disabled>Choose a Category</option>
          {
            !loading && courseCategories.map((category,index)=>(
                <option key={index} value={category?.id}>{category?.name}</option>
            ))
          }
        </select>
        {
          errors.courseCategory && (
            <span>Course Category is Required</span>
          )
        }
      </div>

      {/* Tags Component */}
      {/* <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      /> */}

      {/* Component for uplaoding adn shoring previwe of media */}
      {/* <Upload
        name
        label
        register
        errors
        setValue
        getValues
      /> */}

      {/* Benefit of the course */}
      <div>
        <label> Benefits of the course<sup>*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the Course'
          {...register("courseBenefits",{required:true})}
          className='mih-h-[130px] w-full'
        />
        {
          errors.courseBenfits && (
            <span>
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
        getValues={getValues}
      />



    </form>
  )
}

export default CourseInformationForm