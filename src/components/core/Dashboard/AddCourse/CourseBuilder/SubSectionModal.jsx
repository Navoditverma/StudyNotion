import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createSubSection, updateSection } from '../../../../../services/operations/courseAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from "react-icons/rx";
import IconBtn from '../../../../common/IconBtn';
import Upload from '../Upload';

const SubSectionModal = ({
  modalData,
  setModalData,
  add=false,  
  view=false,
  edit=false
}) => { 


const {
    register,
    handleSubmit,
    setValue,
    formState:{errors},
    getValues
  }=useForm();
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const {course}=useSelector((state)=>state.course);
  const {token}=useSelector((state)=>state.auth)

  useEffect(()=>{
    if(view || edit){
      setValue("lectureTitle",modalData.title)
      setValue("lectureDesc",modalData.desc)
      setValue("lectureVideo",modalData.videoUrl)
    }
  },[])
  const isFormUpdated=()=>{
    const curretValues=getValues();
    if(curretValues.lectureTitle!==modalData.title ||
      curretValues.lectureDesc!==modalData.description ||
      curretValues.lectureVideo!==modalData.videoUrl 
      ){
        return true;
      }
      else{
        return false;
      }
  }
  const handleEditSubSection=async()=>{
    const curretValues=getValues();
    const formData=new FormData();
    formData.append("sectionId",modalData.sectonId)
    formData.append("subSectionId",modalData._id)

    if(curretValues.lectureTitle!==modalData.title){
      formData.append("title",curretValues.lectureTitle);
    }
    if(curretValues.lectureDesc!==modalData.description){
      formData.append("description",curretValues.lectureDesc);
    }
    if(curretValues.lectureVideo!==modalData.videoUrl){
      formData.append("video",curretValues.lectureVideo);
    }
    setLoading(true);
    const result=await updateSection(formData,token);
    if(result){
      const updatedCourseContent=await course.courseContent.map((section)=>
        section._id=modalData.sectonId ? result : section);
        const updatedCourse={...course,courseContent:updatedCourseContent}
        dispatch(setCourse(updatedCourse))
      
    }
    setModalData(null);
    setLoading(false);
  }

  const onSubmit=async(data)=>{
    if (view)
      return;
    if(edit){
      if(!isFormUpdated){
        toast.error("No changes made to the form")
      }
      else{
        handleEditSubSection();
      }
      return;
    }
    const formData=new FormData();
    formData.append("sectionId",modalData)
    formData.append("title",data.lectureTitle)
    formData.append("description",data.lectureDesc)
    formData.append("video",data.lectureVideo)
    setLoading(true);
    //call api
    const result=await createSubSection(formData,token);
    if(result){
      console.log(course.courseContent)
      const updatedCourseContent=await course.courseContent.map((section)=>
        section._id===modalData ? result : section);
        const updatedCourse={...course,courseContent:updatedCourseContent}
        console.log("course dkehlo",updatedCourse)
        dispatch(setCourse(updatedCourse))
    }
    setModalData(null);
    setLoading(false);

  }
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"}{edit && "Editing"} Lecture
          </p>
          <button onClick={()=>(!loading? setModalData(null): {})}>
            <RxCross1 className="text-2xl text-richblack-5"/>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 px-8 py-10">
          <Upload
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              viewData={view ? modalData.videoUrl:null}
              editData={edit ? modalData.videoUrl:null}
          />
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">Lecture Title</label>
            <input
              id='lectureTitle'
              placeholder='Enter Lecture Title'
              {...register("lectureTitle",{required:true})}
               className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Lecture Title is reequired</span>
              
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
             Lecture Description{" "}<sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id='lectureDesc'
              placeholder='enter lecture description'
              {...register ("lectureDesc",{required:true})}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
              errors.lectureDesc && (
                <span className="ml-2 text-xs tracking-wide text-pink-200"> lecture description is required</span>
              )
            }
          </div>
          {
            !view && (
              <div className="flex justify-end">
                <IconBtn
                  text={loading ? "Loading...": edit ? "Save Changes" : "Save"}
                />
              </div>
            )
          }

        </form>
      </div>
    </div>
  )
}

export default SubSectionModal