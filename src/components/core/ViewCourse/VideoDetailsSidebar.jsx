import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconBtn from "../../common/IconBtn"

const VideoDetailsSidebar = ({setReviewModal}) => {
    const[ activeStatus,setActiveStatus]=useState("")
    const [videoBarActive,setVideoBarActive]=useState("")
    const navigate=useNavigate();
    const location=useLocation();
    const {sectionId,subSectionId}=useParams();
    const{
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    }=useSelector((state)=>state.viewCourse)

    useEffect(()=>{
        ;(()=>{
            if(!courseSectionData.length)
                return;
            const currentSectionIndex=courseSectionData.findIndex(
                (data)=>data._id===sectionId
            )
            const currentSubSectionIndex=courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data)=>data._id===subSectionId
            )
            const activeSubSectionId=courseSectionData[currentSectionIndex]?.subSection?.
            [currentSubSectionIndex]?._id;
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        })()
    },[courseSectionData,courseEntireData,location.pathname])

  return (
    <>
        <div>
       {/* for btn and heading */}
            <div>
                <div>   
                    <div>
                        <div
                        onClick={()=>{
                            navigate("/dashboard/enrolled-courses")
                        }}
                        >
                            Back
                        </div>
                        <div>
                            <IconBtn
                                text="Add Review"
                                onClick={()=>setReviewModal(true)}
                            />
                        </div>
                    </div>

                    <div>
                        <p>{courseEntireData?.courseName}</p>
                        <p>{completedLectures?.length}/ {totalNoOfLectures}</p>
                    </div>


                </div>
            </div>
 
            {/* for section and subsection */}

            <div>
            {
                    courseSectionData.map((section,index)=>{
                        <div
                        onClick={()=>setActiveStatus(section?._id)}
                        key={index}>
                        {/* section */}
                            <div>
                                <div>
                                    {section?.courseName}
                                </div>
                                {/* to add arrow icon here and handle rortate */}
                            </div>

                        {/* Subsection */}
                        <div>

                        </div>
                            {
                                activeStatus === section?._id && (
                                    <div>
                                        {
                                            section.subSection.map((topic,index)=>{
                                                <div
                                                className={`felx gap-5 ${topic._id===videoBarActive 
                                                ? "bg-yellow-200 text-richblack-900 " 
                                                : "bg-richblack-900 text-white   "}`}
                                                key={index}
                                                onClick={()=>{
                                                    navigate(`/view-course/${courseEntireData?._id}/section/
                                                    ${section?._id}/sub-section/${topic?._id}}}`)
                                                    setVideoBarActive(topic?._id)
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={completedLectures.includes(topic._id)}
                                                        onChange={()=>{} }
                                                    />
                                                    <span>
                                                         
                                                    </span>

                                                </div>   
                                            })
                                        }
                                    </div>
                                )
                            }

                        </div>

                    })

                    
            }

            </div>
        </div>

    </>
  )
}

export default VideoDetailsSidebar