import React from 'react'
import HighlightText from './HighlightText'
import KnowYourProgess from "../../../assets/Images/Know_your_progress.svg"
import CompareWithOthers from "../../../assets/Images/Compare_with_others.svg"
import PlanYourLessons from "../../../assets/Images/Plan_your_lessons.svg"
import CTAButton from "../HomePage/Button"
 


const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-16'>
      <div className='flex flex-col gap-5 items-center '>

            <div className='text-4xl font-semibold text-center  '>
               Your Swiss Knife for
               <HighlightText text={"learning any language"}/>
            </div>
            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]  '>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex flex-row items-center  justify-center mt-5 '>
                <img src={KnowYourProgess} alt="KnowYourProgess" className='object-contain -mr-32  '/>
                <img src={CompareWithOthers} alt="CompareWithOthers" className='object-contain  '/>
                <img src={PlanYourLessons} alt="PlanYourLessons" className='object-contain -ml-36 '/>

            </div>
            <div className='w-fit  '> 
              <CTAButton active={true}  linkto={"/signup"}>
                <div>
                  Learn More
                </div>

              </CTAButton>

            </div>
            


      </div>
    </div>
  )
}

export default LearningLanguageSection