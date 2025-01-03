import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom'

const viewCourse = () => {
  const {courseId}=useParams();
  const[reviewModal,setReviewModal]=useState(false);
  const {token}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  
  useEffect(()=>{
    const setCourseSpecificDetails=async()=>{
      const courseData=await getFullDetailsCourse(courseId,token);
      dispatch(setCourseSpecificDetails(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures=0
      courseData?.courseDetails?.courseContent?.forEach((sec)=>{
        lectures=sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))

    }
    setCourseSpecificDetails();
  })
  return (
    <>
      <div>
        <VideoDetailsSidebar setReviewModal={setReviewModal}/>
        <div>
          <Outlet/>
        </div>

      </div>
      { 
        reviewModal &&   <CourseReviewModal setReviewModal={setReviewModal} />
      }
    </>
  )
}

export default viewCourse