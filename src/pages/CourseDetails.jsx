import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesApi';

const CourseDetails = () => {

  const {user}=useSelector((state)=>state.profile);
  const {token}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const courseId=useParams();
    const handleBuyCourse=()=>{
        if(token){
            buyCourse(token,[courseId],user,navigate,dispatch);
        }
    }
  return (
    <div className='bg-yellow-50 pp-6 w-20'
    onClick={()=>handleBuyCourse()}
    
    >Buy Now</div>
  )
}

export default CourseDetails