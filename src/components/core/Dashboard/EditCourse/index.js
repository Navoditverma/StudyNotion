import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
import { set } from 'react-hook-form';
import RenderSteps from '../AddCourse/RenderSteps';
export default function EditCourse(){
    const dispatch=useDispatch();
    const {courseId}=useParams();
    const {course}=useSelector((state)=>state.course);
    const [loading,setLoading]=useState(false);
    const {token}=useSelector((state)=>state.auth);
    console.log("Course dekhoge bhaisahab index boolra hu",course)
    useEffect(()=>{
        const populateCouseDetails=async()=>{
            setLoading(true);
            const result=await getFullDetailsOfCourse(courseId,token);
            console.log("useEffectwala",result)
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                console.log("meraresult",result)
                dispatch(setCourse(result?.courseDetails))
            }
            setLoading(false);
        }
        populateCouseDetails()
    },[])


    if(loading){
        return(
            <div>
                Loading....
            </div>
        )
    }
  return (

    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Course</h1>
        <div className="mx-auto max-w-[600px]">
            {
                course ? (<RenderSteps/>) : (<p  className="mt-14 text-center text-3xl font-semibold text-richblack-100">Course Not Found</p>)
            }
        </div>
    </div>
  )
}

