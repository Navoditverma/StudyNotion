import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {getUserEnrolledCourses} from '../../../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar';
import { useState } from 'react';

const EnrolledCourses = () => {

    const {token}=useSelector((state)=>state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const getEnrolledCourses=async()=>{
        try{
            const response= await getUserEnrolledCourses(token);
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
        <div>EnrolledCourses</div>
        {
            !enrolledCourses ? (<div>Loading....</div>) : 
            (!enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>)
            :(
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Durations</p>
                        <p>Progress</p>
                    </div>
                    {/* cards here */}
                    {
                        enrolledCourses.map((course,index)=>(
                            <div>
                                <div>
                                    <img src={course.thumbnail} />
                                    <div>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                    </div>
                                </div>
                                <div>
                                    {course?.totalDuration}
                                </div>
                                <div>
                                    <p>Progress: {course.progressPercentage || 0}</p>
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