import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {getUserEnrolledCourses} from '../../../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const EnrolledCourses = () => {
    const navigate=useNavigate();

    const {token}=useSelector((state)=>state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const getEnrolledCourses=async()=>{  
        try{
            // console.log("REACHINIG EG",token)
            const response= await getUserEnrolledCourses(token);
            // console.log("Enrolled COurses",response.length)
            setEnrolledCourses(response);
        }
        catch(err){
            console.log("Unable to fetch enrolled courses");
        }
    }
    useEffect(()=>{
        getEnrolledCourses();
    },[])

  return (
    <div>
        <div className="text-3xl text-richblack-50">EnrolledCourses</div>
        {
            !enrolledCourses ? (<div>Loading....</div>) : 
            (!enrolledCourses.length ? (<p className="grid h-[10vh] w-full place-content-center text-richblack-5">You have not enrolled in any course yet</p>)
            :(
                <div className="my-8 text-richblack-5">
                    <div className="flex rounded-t-lg bg-richblack-500 ">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Durations</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    {/* cards here */}
                    {
                        enrolledCourses.map((course,i)=>(
                            <div className={`flex items-center border border-richblack-700 ${
                                         i === course.length - 1 ? "rounded-b-lg" : "rounded-none"
                                        }`}>
                                <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                      onClick={() => {
                                             navigate(
                                             `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                             )}}>
                                    <img 
                                    src={course.thumbnail}
                                    alt="course_img"
                                    className="h-14 w-14 rounded-lg object-cover"
                                        
                                    />
                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course.courseName}</p>
                                        <p  className="text-xs text-richblack-300">
                                        {course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)}...`
                                            : course.courseDescription}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-1/4 px-2 py-3">
                                    {course?.totalDuration}
                                </div>
                                <div  className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                    <p>Progress: {course.progressPercentage || 0} %</p>
                                </div>
                                <ProgressBar
                                    completed={course.progressPercentage || 0}
                                    height='8px'
                                    isLabelVisible={false}
                                />
                            </div>
                        ))
                    }
                </div>
            ) )
        }

    </div>
  )
    
}

export default EnrolledCourses