import React from 'react'
import { useState } from 'react';
const RequirementField = ({name,label,register,errors,setValue,getValue}) => {
    const [ requirement , setRequirement]= useState("");
    const[ requirementList,setRequirementList]=useState([]);
    
    const handleAddRequirement=()=>{
        if(requirement){
            setRequirementList([...requirementList,requirement])
            setRequirement("");
        }

    }
    const handleRemoveRequirement=(index)=>{
        const updatedRequirementList=[...requirementList];
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList);
        
    }
  return (
    <div>
        <label html={name}>
            {label}<sup>*</sup>
        </label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e)=>setRequirement(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                        handleAddRequirement(requirement)
                    }
                }}
                className='w-full'
            />
            <button type='button' onClick={handleAddRequirement}
                className='font-semibold text-yellow-50  '
            >Add</button>
        </div>
        {
            requirementList.length>0 && (
                <ul>
                    {
                        requirementList.map((req,index)=>(
                            <li key={index} className='flex items-center text-richblack-5 '>
                                <span>{req}</span>
                                <button
                                    type='button'
                                    onClick={handleRemoveRequirement}
                                    className='text-sm text-pure-greys-300 '
                                >
                                clear
                                </button>

                            </li>
                        ))
                    }
                </ul>
            )
        }
    </div>
  ) 
}

export default RequirementField