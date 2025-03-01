import React, { useState } from 'react'
import { BsPass } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncError, useLocation } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
const UpdatePassword = () => {
    const dispatch=useDispatch();
    const[formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    })
    const[showPassword,setShowPassword]=useState(false);
    const[showConfirmPassword,setShowConfirmPassword]=useState(false);

    const {loading} = useSelector((state)=> state.auth);
    const handleOnChange= (e)=>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value,
        }))

        
    }
    const location=useLocation();
    const {password,confirmPassword}=formData.data
    const handleOnSubmit= (e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token))
        

    }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading? 
            (<div>
                Loading...
            </div>) :
            (
                <div className="max-w-[500px] p-4 lg:p-8"> 
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">Choose new Password</h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        Almost done. Enter your new password and youre all set.
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        <label className="relative">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                new password  <sup className="text-pink-200">*</sup>
                            </p>
                            <input
                                type={showPassword? "text":"password"}
                                name='password'
                                value={password} 
                                onChange={handleOnChange}
                                placeholder='Password'
                                className="form-style w-full !pr-10"
                            />
                            <span
                            onClick={()=>(setShowPassword((prev) => !prev))}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            
                            >
                                {
                                    showPassword ? <IoMdEye fontSize={24} fill="#AFB2BF" /> : <IoMdEyeOff fontSize={24} fill="#AFB2BF"/>
                                }

                            </span>

                        </label>

                        <label className="relative mt-3 block">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                new Confirm Password <sup className="text-pink-200">*</sup>
                            </p>
                            <input
                                type={showConfirmPassword? "text":"password"}
                                name='confirmPassword'
                                value={confirmPassword} 
                                onChange={handleOnChange}
                                placeholder='Confirm Password'
                                className="form-style w-full !pr-10"
                            />
                            <span
                            onClick={()=>(setShowConfirmPassword((prev) => !prev))}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            
                            >
                                {
                                    showPassword ? <IoMdEye fill="#AFB2BF" fontSize={24} /> : <IoMdEyeOff fill="#AFB2BF" fontSize={24} />
                                }

                            </span>

                            <button type='submit' 
                            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                                Reset Password
                            </button>
                        </label>
                    </form>
                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/login">
                                <p className="flex items-center gap-x-2 text-richblack-5">Back to Login</p>

                            </Link>
                        </div>
                </div>
            )

        }
    </div>
  )
}

export default UpdatePassword