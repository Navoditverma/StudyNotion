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
                <div>
                  <img  
                    src={course.course.thumbnail }
                    alt='course ka thumbnail'
                    className={`h-[400px]  rounded-xl object-cover `}
                  />

                </div>
                <div>
                  <p>{course.course?.courseName}</p>
                  <p>{course.course.instructor?.firstName} {course.course.instructor?.lastName}</p>
                  <div>
                    <span>
                        {avgReviewCount}
                    </span>
                    <RatingStars Review_Count={avgReviewCount}/>
                    <span>{course.course.ratingAndReviews?.length} Ratings</span>
                  </div>
                  <p>{course.course.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card