import React from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from "../../../../common/IconBtn"
import { useState } from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import {BiRightArrow} from "react-icons/bi"
import {setCourse, setEditCourse,setStep} from "../../../../../slices/courseSlice"
import {updateSection} from "../../.././../../services/operations/courseAPI"
import toast from 'react-hot-toast';
import { createSection } from '../../.././../../services/operations/courseAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {
  const {token} =useSelector((state)=>state.auth)
  const {register,
          handleSubmit,
          setValue,
          formState:{errors},
  }=useForm();
  const[loading,setLoading]=useState(false);
  const dispatch=useDispatch();


  const cancelEdit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const onSubmit=async(data)=>{
    setLoading(true);
    let result;
    if(editSectionName){
      result= await updateSection(
        {
          sectionName:data.sectionName,
          sectionId:editSectionName,
          courseId:course
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
      dispatch(setCourse(result))
      setEditSectionName(null);
      setValue("sectionName")
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




  const {course}=useSelector((state)=>state.course)

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




  const [editSectionName,setEditSectionName]=useState(null);

  return (
    <div>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div>
          <label>Sectin Name<sup>*</sup></label>
          <input
            id="sectionName"
            placeholder='Add section'
            {...register("sectionName",{required:true})}
            className='w-full'
          />
          {
            errors.sectionName && (
              <span>Section Name is required</span>
            )
          }
        </div>
        <div className='mt-10'>
          <IconBtn
          type="submit"
          text={editSectionName ? "Edit Section Name" : "Create section"}
          outline={true}
          customClasses={"text-black "}
          >
            <IoMdAddCircleOutline className='' />
          </IconBtn>
          {editSectionName && (
            <button
            onClick={cancelEdit}
            className='text-sm text-richblack-300 underline '
            type='button '
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length >0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSection}/>
      )}
      <div className='flex justify-end gap-x-3'>
        <button
        onclick={goBack}
        className='rounded-md cursor-pointer flex items-center '
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