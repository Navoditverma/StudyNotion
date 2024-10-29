import React, { useState } from 'react'
import ConformationModal from "../../../../common/ConformationModal"
import { useDispatch, useSelector } from 'react-redux'

const NestedView = () => {
    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();
    const [addSubSection,setAddSubSection]=useState(null);
    const [editSubSection,setEditSubSection]=useState(null);
    const [viewSubSection,setViewSubSection]=useState(null);
    const [ConformationModal,setConformationModal]=useState(null);

  return (
    <div>
        <div>
            {course?.courseContent.map((section)=>(
                <details key={section._id}  open >
                    <summary>
                        
                    </summary>
                </details>
            ))}


        </div>

    </div>
  )
}

export default NestedView