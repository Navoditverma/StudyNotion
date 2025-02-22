import React, { useEffect } from 'react'
import 'swiper/css';
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import ReactStars from 'react-stars';
import {ratingsEndpoints} from "../../services/api"
import {FaStar} from "react-icons/fa"
import { useState } from 'react';
import {apiConnector} from "../../services/apiConnector"


const ReviewSlider = () => {
  const[reviews,setReviews]=useState([]);
  const truncateWords=15;
  useEffect(()=>{
    const fetchAllRatings=async()=>{
      console.log("fetching rewies")
      const {data}= await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
      console.log("succesfully to fetch rewies")

      if(data?.success){
        setReviews(data?.data)
      }
    }
    fetchAllRatings()
  },[])
  return (
    <div>
      <div>
        <Swiper
        slidesPerView={4}
        spaceBetween={24}
        loop={true}
        freeMode={true}
        autoplay={
          {
            delay:2500
          }
        }
        modules={[FreeMode,Navigation,Pagination]}
        >
        {
          reviews.map((review,index)=>(
            <SwiperSlide key={index}>
                <img
                  src={review?.user?.image ?  review?.user?.image :
                    `https:/api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt='Profile PIc'
                />
                <p>{review?.user?.firstName} {review?.user?.lastName}</p>
                <p>{review?.course?.courseName}</p>
                <p>{review?.review}</p>
                <p>{review?.rating}</p>

                <ReactStars 
                  count={5}
                  value={review.rating}
                  size={20}
                  edit={false}
                  activeColor="ffD700"
                  emptyIcon={<FaStar/>}
                  fullIcon={<FaStar/>}
                  />


            </SwiperSlide> 
          ))
        }
          
        </Swiper>
      </div>
       
    </div>
  )
}

export default ReviewSlider