import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import {FaShareSquare} from 'react-icons/fa'
import {ACCOUNT_TYPE} from "../../../utils/constants"
import { addToCart } from '../../../slices/cartSlice';
export function CourseDetailCard({course,setConformationalModal,handleBuyCourse}){
  const{
    thumbnail:thumbnailImage,
    price:currentPrice
  }=course
  console.log("coursecard details",course)
  const {token}=useSelector((state)=>state.auth);
  const {user}=useSelector((state)=>state.profile)
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleAddToCart=()=>{
      if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
        toast.error("You are an instructor , you cant buy a course");
        return;
      }
      if(token){
        dispatch(addToCart(course));
        return;
      }
      setConformationalModal({
        text1:"You are not logged in",
        text2:"Please Login to add to cart",
        btn1Text:"login",
        btn2Text:"cancel",
        btn1Handler:()=>navigate("/login"),
        btn2Handler:()=>setConformationalModal(null)
         
        
      })
  }
  const handleShare=()=>{
    copy(window.location.href)
    toast.success("Link Copied Succesfully")
  }
  return(
    <div
    className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
    >
      <img
        src={thumbnailImage}
        alt='Thumbnail Image' 
       className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          Rs. {currentPrice}
        </div>
        <div  className="flex flex-col gap-4">
          <button
          onClick={
            user && course?.studentsEnrolled.includes(user?._id) ? 
            ()=>navigate("/dashboard/enrolled-courses") :
            handleBuyCourse
          }
          >
              {
                user && course?.studentsEnrolled.includes(user?._id) ? " Go to Course" : "Buy Now"
              }
          </button>
        
            { 
              (!course?.studentsEnrolled.includes(user?._id)) && (
                  <button
                  onClick={handleAddToCart}>
                    Add to Cart

                  </button>
              )

            }
          </div>
          <div>
            <p>30-Day Money-Back Guarantee</p>
            <p>This Course Includes:</p>
            <div>
              {
                course?.instructions?.map((item,index)=>(
                  <p key={index}>
                    <span>{item}</span>

                  </p>
                ))
              }
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
    </div>
  )
}
