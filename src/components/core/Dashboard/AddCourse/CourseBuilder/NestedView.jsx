import React, { useState } from 'react'
import ConformationModal from "../../../../common/ConformationModal"
import { useDispatch, useSelector } from 'react-redux' 
import { RxDropdownMenu } from "react-icons/rx";
import {MdEdit} from "react-icons/md"
import { RiDeleteBin6Fill } from "react-icons/ri" 
import {IoMdArrowDropdown} from "react-icons/io"
import { FaPlus } from "react-icons/fa6";
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import SubSectionModal from './SubSectionModal';



const NestedView = ({handleChangeEditSectionName}) => {
    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch(); 
    const [addSubSection,setAddSubSection]=useState(null);
    const [editSubSection,setEditSubSection]=useState(null);
    const [viewSubSection,setViewSubSection]=useState(null);
    const [conformationModal,setConformationModal]=useState(null);

    const handleDeleteSection=async(sectionId)=>{
        const result=await deleteSection({
            sectionId,
            courseId:course._id,
            token,

        })
        if(result){
            dispatch(setCourse(result))
        }
        setConformationModal(null);

    }
    const handleDeleteSubSection=async(subSectionId,sectionId)=>{
        const result=await deleteSubSection({subSectionId,sectionId,token});
        if(result){
            const updatedCourseContent=await course.courseContent.map((section)=>
                section._id=sectionId ? result : section);
            const updatedCourse={...course,courseContent:updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConformationModal(null);

    }

  return (
    <div>
        <div className='text-richblack-700 rounded p-6 '>
        
            {course?.courseContent?.map((section)=>(
                <details key={section._id}  open >
                    <summary className='flex items-center justify-between gap-x-3 border-b-2 '>
                        <div>
                            <RxDropdownMenu/>
                            <p>{section.sectionName}</p>
                        </div>
                        <div className='flex items-center '>   
                            <button
                            onClick={handleChangeEditSectionName(section._id,section.sectionName)}
                            >
                                <MdEdit/>
                            </button>
                            <button
                            onClick={()=>{
                                setConformationModal({
                                    text1:"Delete this Section",
                                    text1:"All the lectures in this section  will be deleted",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
                                    btn1Handler:()=>handleDeleteSubSection(section._id),
                                            btn2Handler:()=> setConformationModal(null)      
                                })
                            }}
                            >
                                <RiDeleteBin6Fill />
                            </button>
                            <span>|</span>
                            <button><IoMdArrowDropdown  className='text-xl text-richblack-100'/></button>

                        </div>
                    </summary>

                    <div>
                        {
                            section.subSection.map((data)=>{
                                <div key={data.id} onClick={()=>setViewSubSection(data)}
                                className='flex items-center justify-between gapx4 border-b-2'>
                                    <div>
                                        <RxDropdownMenu/>
                                        <p>{data.title}</p>
                                    </div>
                                    <div className='felx items-center gap-x-3'
                                    onClick={(e)=>e.stopPropagation}
                                    >
                                        <button
                                        onClick={()=>setEditSubSection({...data,sectionId:section._id})}
                                        >
                                            <MdEdit/>
                                        </button>
                                        <button
                                        onClick={()=>{setConformationModal({
                                            text1:"Delete this Sub Section",
                                            text1:"Current Lecture will be deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                            btn2Handler:()=> setConformationModal(null)     
                                            })
                                        }}
                                        >
                                          <RiDeleteBin6Fill />
                                        </button>


                                    </div>

                                </div>
                            })
                        }
                        <button
                         onClick={()=>setAddSubSection(section._id)}
                         className='mt-5 flex items-center gap-x-2'
                         >
                            <FaPlus />
                            <p>Add lecture</p>
                        </button>
                    </div>
                </details>
                
            ))}


        </div>
        {
            addSubSection?  (<SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
            />) : 
            viewSubSection ? (<SubSectionModal
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}


            />) : 
            editSubSection? (<SubSectionModal
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}


            />) : 
            <div></div>
            }

            {conformationModal ? 
            (<ConformationModal modalData={conformationModal}/>):
            (<></>)
            }

    </div>
  )
}

export default NestedView