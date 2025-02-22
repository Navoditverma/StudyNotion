import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Player } from 'video-react';
import { useRef,useState } from 'react';
import IconBtn from '../../common/IconBtn';

// import "~video-react/dist/video-react.css"
import {AiFillPlayCircle} from "react-icons/ai"
const VideoDetails = () => { 
  const {courseId,sectionId,subSectionId}=useParams()
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const  playerRef=useRef();
  const {token}=useSelector((state)=>state.auth)
  const location=useLocation();
  const {courseSectionData,courseEntireData,completedLectures}=useSelector((state)=>state.viewCourse);
  const [videoData,setVideoData]=useState([]);
  const [videoEnded,setVideoEnded]=useState(false)
  const [loading,setLoading]=useState(false);


  useEffect(()=>{
    const setVideoSpecificDetails=async()=>{
      if(!courseSectionData.length) return;
      if(!courseId && !sectionId & !subSectionId){
        navigate("/dashboard/enrolled-courses")
      }
      else{
        const filteredData=courseSectionData.filter(
          (course)=>course._id === sectionId
        )
        const filteredVideoData=filteredData?.[0].subSection.filter(
          (data)=>data._id===sectionId
        )
        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }

    }
    setVideoSpecificDetails()
  })
  


  const isFirstVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === sectionId

    )
    if(currentSectionIndex ===0 && currentSubSectionIndex===0){
      return true
    }
    else{
      return false
    }

  }
  const isLastVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )
    const noOfSubSections=courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === sectionId

    )
    if(currentSectionIndex ===courseSectionData.length-1 && currentSubSectionIndex===noOfSubSections-1){
      return true
    }
    else{
      return false
    }
    
  }
  const goToNextVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )
    const noOfSubSections=courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === sectionId

    )
    if(currentSectionIndex !==noOfSubSections-1 ){
      //same section next video
      const nextSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}}`)
    }
    else{
      // diff section first video
      const sectionId=courseSectionData[currentSectionIndex+1];
      const nextSubSectionId=courseSectionData[currentSectionIndex+1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}}`)
    }
    
  }
  const goToPreviousVideo=()=>{
    const currentSectionIndex=courseSectionData.findIndex(
      (data)=>data._id === sectionId
    )
    const noOfSubSections=courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex(
      (data)=>data._id === sectionId
 
    )
    if(currentSectionIndex !=0){
      // same setino prev video
      const prevSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1];
      // iss Video par 
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}}`)
    }
    else{
      // diff sectionlast vide
      const prevSectionId=courseSectionData[currentSectionIndex-1]._id;
      const prevSubSectionLength=courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionId=courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}}`)

    }  
    
  }
  const handleLectureCompletion=()=>{
    
  } 
  return (
    <div>
    {
      !videoData ? (<div>NO data Found</div>) : 
      (
        <Player
        aspectRatio='16:9'
        ref={playerRef}
        playsInline
        onEnded={()=>setVideoEnded(true)}
        src={videoData?.videoUrl}
        >
          <AiFillPlayCircle />

          {
            videoEnded && (
              <div>
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn
                        disabled={loading}
                        onClick={()=>handleLectureCompletion()}
                        text={!loading ? "Mark as completed" : "Loading"}
                      />
                    )
                  }
                  <IconBtn
                        disabled={loading}
                        onClick={()=>{
                          if(playerRef?.current){
                            playerRef.current?.seek(0);
                            setVideoEnded(false);
                          }
                        }}
                        text={"Rewatch"}
                        customClasses="text-xl"
                  />

                  <div>
                    {
                      !isFirstVideo() && (
                        <button
                        disabled={loading}
                        onClick={goToPreviousVideo}
                        className='blackButton'
                        >
                          Prev
                        </button>
                      )
                    }
                    {
                      !isLastVideo() && (
                        <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className='blackButton'
                        >
                          Next

                        </button>
                      )
                    }
                  </div>

              </div>
            )
          }
        </Player>
      )
    }
    <h1>{videoData?.title}</h1>
    <p>{!videoData?.description}</p>
       
    </div>
  )
    
}

export default VideoDetails