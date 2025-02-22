import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import { useForm } from 'react-hook-form'
import IconBtn from "../../common/IconBtn"
import {createRating} from "../../../services/operations/courseAPI"

const VideoReviewModal = ({ setReviewModal }) => {

    const {user}=useSelector((state)=>state.profile)
    const {token}=useSelector((state)=>state.auth)
    const {courseEntireData}=useSelector((state)=>state.viewCourse)

    const{
        register,
        handleSubmit,
        setValue,
        formState:{errors},
    }=useForm()

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating",0)
    },[])
    const ratingChanged=(newRating)=>{
        setValue("courseRating",newRating)

    }
    const onSubmit=async (data)=>[
        await createRating({
            courseId:courseEntireData._id,
            rating:data.courseRating,
            review:data.courseExperience

        },token)

    ]
  return (
    <div>
        <div>
            {/* modal header */}
            <div>
                <p> Add Review </p>
                <button
                onClick={()=>setReviewModal(false)}
                >
                    Close
                </button>
            </div>
            {/* Modal Body */}
            <div>
                <div>
                    <img
                        src={user?.image}
                        alt='user image'
                        className=''
                    />
                    <div>
                        <p>{user?.firstName} {user?.lastName }</p>
                         <p>Posting Publicly</p>
                    </div>
                </div>
                
                <form
                onSubmit={handleSubmit(onSubmit)}>

                    <ReactStars 
                    count={5}
                    size={24}
                    activeColor="#ffc700"
                    onChange={ratingChanged}

                    
                     />

                     <div>
                        <label
                            htmlFor='courseExperience'>
                                Add Your Expreience 
                        </label>
                        <textarea
                        id="courseExperience"
                        placeholder='Add Your experience here '
                        {...register("courseExperience" , {required:true})}
                        />
                        {
                            errors.courseExperience && (
                                <span>
                                    Pls add your Expreience
                                </span>
                            )
                        }

                     </div>
                     <div>
                        <button
                        onClick={()=>setReviewModal(false)}>
                            Cancel
                        </button>
                        <IconBtn
                            text="save"
                        />
                     </div>

                </form>
            </div>

        </div>

    </div>
  )
}

export default VideoReviewModal