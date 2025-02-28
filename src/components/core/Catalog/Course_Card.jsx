import React, { useEffect, useState } from 'react'
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import { Link } from 'react-router-dom'
const Course_Card = (course,Height) => {


const[avgReviewCount,setAvgReviewCount]=useState(0);

useEffect(()=>{
  const count=GetAvgRating(course.ratingAndReviews)
  setAvgReviewCount(count);
  console.log(course)
},[course])


  return (
    <div>
        <Link
        to={`/courses/${course.course._id}`}
        >
            <div>
                <div className="rounded-lg">
                  <img  
                    src={course.course.thumbnail }
                    alt='course ka thumbnail'
                    className={`${Height} w-full rounded-xl object-cover `}
                  />

                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                  <p className="text-xl text-richblack-5">{course.course?.courseName}</p>
                  <p className="text-sm text-richblack-50">{course.course.instructor?.firstName} {course.course.instructor?.lastName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-5">
                        {avgReviewCount}
                    </span>
                    <RatingStars Review_Count={avgReviewCount}/>
                    <span className="text-richblack-400">{course.course.ratingAndReviews?.length} Ratings</span>
                  </div>
                  <p  className="text-xl text-richblack-5">{course.course.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card