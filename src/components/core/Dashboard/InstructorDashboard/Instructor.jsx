import React, { useEffect } from 'react'
import {fetchInstructorCourses} from '../../../../services/operations/courseAPI'
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {getInstructorData} from '../../../../services/operations/profileAPI';
import InstructorChart from "../InstructorDashboard/InstructorChart"
import { Link } from 'react-router-dom';

const Instructor = () => { 
    const {user}=useSelector((state)=>state.profile)
    

    const {token}=useSelector((state)=>state.auth);
    const [loading, setLoading]=useState(false);
    const [instructorData, setInstructorData]=useState([]);
    const [courses, setCourses]=useState([]);

    useEffect(()=>{
        const getCourseDataWithStats=async()=>{
            try{

                //prending
                setLoading(true);
                const instructorApiData=await getInstructorData(token);
                const result=await fetchInstructorCourses(token);

                console.log("INSTRUCTOR API DATA",instructorApiData);
                if(instructorApiData.lenght){
                    setInstructorData(instructorApiData);
                }
                if(result){
                    setCourses(result);
                }
                setLoading(false);
            }
            catch(error){
                console.log(error);
                setLoading(false);
            }
        }
        getCourseDataWithStats();
        
    },[])
    const totalAmount = instructorData?.reduce(
        (acc, curr) => acc + curr.totalAmountGenerated,
        0
      )
    
      const totalStudent = instructorData?.reduce(
        (acc, curr) => acc + curr.totalStudentsEnrolled,
        0
      )
  return (
    <div>
        <div>
            <h1>Hi {user?.firstName}</h1>
            <p>Let's start something</p>
        </div>

        {
            loading ? (<div className='spinner'></div>):
            courses.length >0
            ? (
                <div>
                    <div>
                        <InstructorChart courses={instructorData} />
                        <div>
                            <p>Statistics</p>
                            <div>
                                <p>Total Students</p>
                                <p>{totalStudent}</p>
                            </div>

                            <div>
                                <p>Total Income</p>
                                <p>{totalAmount}</p>
                            </div>

                            
                        </div>

                    </div>
                    <div>
                        {/* Render 3 courses */}
                        <div>
                            <p>
                                Your Courses
                            </p>
                            <Link to="/dashboard/my-courses">
                                <p>View All</p>
                            </Link>
                        </div>
                        <div>
                            {
                                courses.slice(0,3).map((course)=>(
                                    <div>
                                        <img
                                            src={course.thumnail}
                                        />
                                        <div>
                                            <p>{course.courseName}</p>
                                            <div>
                                                <p>{course.studentsEnrolled.length}</p>
                                                <p> | </p>
                                                <p>Rs {course.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
            :
            (
                <div>
                    <p>You have no created any course</p>
                    <Link to={"/dashboard/addCourse"}>Create a Course</Link>

                </div>
            )
        }
        
        
    </div>
  )
}

export default Instructor