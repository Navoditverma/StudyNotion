import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useNavigation } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseAPI'
import CoursesTable from "./InstructorCourses/CoursesTable"
import IconBtn from '../../common/IconBtn'
const MyCourses = () => {
    const {token} =useSelector((state)=>state.auth)
    const navigate=useNavigate();
    const[courses,setCourses]=useState([]);

    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token,);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    },[])
  return (
    <div className='text-white'>
        <div>
            <h1>My Courses</h1>
            <IconBtn
                text="Add Course"
                onClick={()=>navigate("/dashboard/add-course")}
                //totdo add icon

            />
        </div>
        {
            courses && <CoursesTable courses={courses} setCourses={setCourses}/>
        }

    </div>
  )
}

export default MyCourses