import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import { buyCourse } from "../../../../services/operations/studentFeaturesApi"
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const RenderTotalAmount = () => {
    const {total}=useSelector((state)=>state.cart)
    const {cart}=useSelector((state)=>state.cart)
    const {token}=useSelector((state)=>state.auth)
    const { user } = useSelector((state) => state.profile)

    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleBuyCourse=()=>{
        const courses =cart.map((course)=>course._id);
         if (token) {
              buyCourse(token, courses, user, navigate, dispatch)
              return
            }
        toast.error("Please Login to continue")
         

    }
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}

export default RenderTotalAmount