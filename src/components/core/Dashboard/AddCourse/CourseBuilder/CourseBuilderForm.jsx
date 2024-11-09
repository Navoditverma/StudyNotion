import React from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from "../../../../common/IconBtn"
import { useState } from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import {BiRightArrow} from "react-icons/bi"
import {setCourse, setEditCourse,setStep} from "../../../../../slices/courseSlice"
import {getFullDetailsOfCourse, updateSection} from "../../.././../../services/operations/courseAPI"
import toast from 'react-hot-toast';
import { createSection } from '../../.././../../services/operations/courseAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {
  const {token} =useSelector((state)=>state.auth)
  const {course}=useSelector((state)=>state.course)
  const[loading,setLoading]=useState(false);
  const dispatch=useDispatch();
  const [editSectionName,setEditSectionName]=useState(null);
  // const courseData =  getFullDetailsOfCourse(course._id,token)
  // console.log("yeh delkho maalik",courseData)
  console.log(course)


  const {
          register,
          handleSubmit,
          setValue,
          formState:{errors},
  }=useForm();
 


  const cancelEdit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const onSubmit= async (data)=>{
   
    setLoading(true);
    let result;
    if(editSectionName){
      result= await updateSection(
        {
          sectionName:data.sectionName,
          sectionId:editSectionName,
          courseId:course._id
        },token 
      )
    }
    else{
      result=await createSection({
        sectionName:data.sectionName,
        courseId:course._id,
      },token)
    }

    //Update values


    if(result){
      console.log(course)
      dispatch(setCourse(result))
      setEditSectionName(null);
      setValue("sectionName","")
    }
    setLoading(false)

    
  }
  const handleChangeEditSection=(sectionId,sectionName)=>{ 
    if(setEditSectionName===sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }




  

  const goToNext=()=>{
    if(course.courseContent.length===0){
      toast.error("Please add atleast one section")
      return;
    }
    if(course.courseContent.some((section)=>section.subSection.length==0)){
        toast.error("Please add atleast one lecture in each section");
        return;
    }
    dispatch(setStep(3));

  }
  const goBack=()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }





  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" >Section Name<sup className="text-pink-200">*</sup></label>
          <input
            id="sectionName"
            placeholder='Add section'
            {...register("sectionName",{required:true})}
            className="form-style w-full"
          />
          {
            errors.sectionName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
            )
          }
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
          type="submit"
          text={editSectionName ? "Edit Section Name" : "Create section"}
          outline={true}
          customClasses={"text-black "}
          >
            <IoMdAddCircleOutline className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
            onClick={cancelEdit}
            className="text-sm text-richblack-300 underline"
            type='button '
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

        {course?.courseContent?.length >0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSection}/>
        )}

      
      <div className="flex justify-end gap-x-3">
        <button
        onclick={goBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn text="Next" onclick={goToNext} >
          <BiRightArrow/>
        </IconBtn>
      </div>
      

    </div>
  )
}

export default CourseBuilderForm