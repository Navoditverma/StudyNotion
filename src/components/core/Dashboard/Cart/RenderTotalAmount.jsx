import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
const RenderTotalAmount = () => {
    const {total}=useSelector((state)=>state.cart)
    const {cart}=useSelector((state)=>state.cart)

    const handleBuyCourse=()=>{
        const courses =cart.map((course)=>course._id);
        console.log("Bought these courses:", courses);
        // APi integration to paymnet gateway latter 

    }
  return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>

        <IconBtn
            text="Buy Now"
            onClick={handleBuyCourse}
            customClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount