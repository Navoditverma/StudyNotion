import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesApi';
import { setCourse } from '../slices/courseSlice';
import {fetchCourseDetails} from "../services/operations/courseAPI"
import GetAvgRating from "../utils/avgRating"
import ConformationModal from "../components/common/ConformationModal"
import RatingStars from "../components/common/RatingStars"
import {formatDate} from "../services/formatDate"
import { TfiWorld } from "react-icons/tfi";
import {CourseDetailCard} from "../components/core/Course/CourseDetailCard"


const CourseDetails = () => {

  const {user}=useSelector((state)=>state.profile);
  const {token}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const courseId=useParams();
  const [courseData,setCourseData]=useState(null);
  const {loading}=useSelector((state)=>state.profile);
  const {paymentLoading}=useSelector((state)=>state.course);

  const [avgReviewCount, setAverageReviewCount]=useState(0);
  const [totalNoOfLectures,setTotalNoOfLectures]=useState(0);
  const [conformationalModal,setConformationalModal]=useState(null);
  const [isActive,setIsActive]=useState(Array(0));
  
  useEffect(()=>{
    const getCourseFullDetails=async()=>{
        try{
            const result=await fetchCourseDetails(courseId)
            setCourseData(result);
          }
        catch(err){
          console.log("could not fetch course details ",err);  

        }
      
    }   
    getCourseFullDetails();
    },[courseId]
  )

  useEffect(()=>{
    const count=GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
    setAverageReviewCount(count)

  },[courseData])

  useEffect(()=>{
    let lectures=0;
    courseData?.data?.courseDetails?.courseContent?.forEach((sec)=>{
      lectures+=sec.subSection.length || 0;

    })
    setTotalNoOfLectures(lectures);


  },[courseData])


  const handleBuyCourse=()=>{
      if(token){
          buyCourse(token,[courseId],user,navigate,dispatch);
          return;
      }
      else{
        setConformationalModal({
          text1:"you are not Logged in",
          text2:"Please Login to purchase the course",
          btn1Text:"Login",
          btn2Text:"Cancel",
          btn1Handler:()=>navigate("/login"),
          btn2Handler:()=>setConformationalModal(null)
    
        })
        
      }
  }
  const handleActive=(id)=>{
    setIsActive(
      !isActive.includes(id)
      ? isActive.concat(id)
      : isActive.filter((e)=>e!=id)
    )


  }

  if(loading || !courseData){
    return(
      <div>
        loading...
      </div>
    )

  }
  const {
    _id:course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,

  }=courseData.data?.courseDetails
  return (

    <div>
      <div>
          <p>{courseName}</p>
          <p>{courseDescription}</p>
          <div>
            <span>{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
            <span>{`(${ratingAndReviews.length} Reviews)`}</span>
            <span>{`(${studentsEnrolled.length} Students Enrolled)`}</span>
          </div>
          
          <div>     
            <p> Created By {`${instructor.firstName }`}</p>
          </div>

          <div>
            <p> Created At {formatDate(createdAt)}</p>
            <p> <TfiWorld/>  
              English
            </p>
      </div>

      <div>
          <CourseDetailCard course={courseData?.data?.courseDetails} 
            setConformationalModal={setConformationalModal}
            handleBuyCourse={handleBuyCourse}
          /> 
      </div>


      
    </div>
    <div>
      <p>What you will learn</p>
      <div>
        {whatYouWillLearn}
      </div>
    </div>

    <div>
      <div>
        <p>Course Content</p>
      </div>

      <div>
        <span>{courseContent.length} section(s)</span>
     
        <span>{totalNoOfLectures} lectures</span>
        <span>{courseData.data?.totalDuration} total Length</span>
      </div> 
      <div>
        <button
        onClick={setIsActive([])}>
          Collapse all sections
        </button>
      </div>
    </div>

      


      {conformationalModal && <ConformationModal modalData={conformationalModal}/>}
    </div>
    


  )
}

export default CourseDetails