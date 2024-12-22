import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Thead ,Th,Td,Tr} from 'react-super-responsive-table';
import ConformationModal from '../../../common/ConformationModal'
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseAPI';
import { setCourse } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants';
 
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Navigate, useNavigate } from 'react-router-dom';
export default function CoursesTable({courses, setCourses}){

    const dispatch=useDispatch();
    const {token}=useSelector((state)=>state.auth)
    const [loading,setLoading]=useState(false);
    const [confirmationModal,setConformationModal]=useState(null)
    const navigate=useNavigate();


    const handleDeleteCourse=async(courseId)=>{
        setLoading(true);
        await deleteCourse({courseId:courseId},token);
        const result=await fetchInstructorCourses(token);
        if(result){
            setCourses(result)
        }
        setConformationModal(null);
        setLoading(false)
    }
  return (
    <div className='text-white '>
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        Courses
                    </Th>
                    <Th>
                        Duration
                    </Th>
                    <Th>
                        Price
                    </Th>
                    <Th>
                        Actions
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    courses.length===0 ?(
                        <Tr>
                            <Td>
                                NO courses found
                            </Td> 
                        </Tr>
                    ):
                    (
                        courses.map((course)=>(
                            <Tr key={course._id} className="flex gap-x-10 border-richblack-800 p-8 "  >
                                <Td className='flex'>
                                    <img src={course?.thumbnail}
                                        className='h-[150px] w-[200px] rounded-lg object-cover '
                                    />
                                    <div className='flex flex-col'>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                        <p>Created At: </p>
                                        {
                                            course.status === COURSE_STATUS.DRAFT ? (
                                                <p>Drafted</p>
                                            ):
                                            (
                                                <p>Published</p>
                                            )
                                        }
                                    </div>
                                </Td>
                                <Td>
                                    2hr 30min
                                </Td>
                                <Td>
                                    ${course.price}
                                </Td>
                                <Td>
                                    <button
                                    disabled={loading}
                                    onClick={()=>{
                                        navigate(`/dashboard/edit-course/${course._id}`)
                                    }
                                    }
                                    >
                                        EDIT
                                    </button>
                                    <button
                                    disabled={loading}
                                    onClick={()=>{
                                        setConformationModal({
                                            text1: "Do you want to delete this course?",
                                            text2:"All the data realted to this course will be deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:!loading ? ()=> handleDeleteCourse(course._id):()=>{},
                                            btn2Handler:!loading ? ()=> setConformationModal(null):()=>{},
                                    })
                                    }}
                                    >
                                        Delete 
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
        {
            confirmationModal && <ConformationModal modalData={confirmationModal}/>
        }
    </div>
  )
}

