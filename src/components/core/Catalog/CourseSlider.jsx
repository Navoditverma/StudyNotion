import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import Course_Card from './Course_Card';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';



const CourseSlider = ({Courses}) => {
  console.log("slider",Courses)
  return (
    <>
      {
        
        Courses?.length ? (
          <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={
            {delay:2500,
            disableOnInteraction:false}
          }
          spaceBetween={300}
          modules={[Pagination,Autoplay,Navigation]}
          pagination={true}
          breakpoints={{
            1024:{slidesPerView:3,}
          }}
          
          >
              {
                Courses?.CourseSlider?.map((course,index)=>(
                  <SwiperSlide key={index}>
                      <Course_Card course={course} height={"h-[250px]"} />
                  </SwiperSlide>
                ))
              }
          </Swiper>
        ) : 
        ( 
           <p> No Courses Found</p>
        )
      }
    </>
  )
}

export default CourseSlider