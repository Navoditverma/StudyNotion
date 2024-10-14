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
    <div>
        {
            loading? 
            (<div>
                Loading...
            </div>) :
            (
                <div> 
                    <h1>Choose new Password</h1>
                    <p>
                        Almost done. Enter your new password and youre all set.
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>
                                new password <sup>*</sup>
                            </p>
                            <input
                                type={showPassword? "text":"password"}
                                name='password'
                                value={password} 
                                onChange={handleOnChange}
                                placeholder='Password'
                                className='w-full p-6 bg-richblack-600 text-richblack-5  '
                            />
                            <span
                            onClick={()=>(setShowPassword((prev) => !prev))}
                            
                            >
                                {
                                    showPassword ? <IoMdEye fontSize={24} /> : <IoMdEyeOff fontSize={24} />
                                }

                            </span>

                        </label>

                        <label>
                            <p>
                                new Confirm Password <sup>*</sup>
                            </p>
                            <input
                                type={showConfirmPassword? "text":"password"}
                                name='confirmPassword'
                                value={confirmPassword} 
                                onChange={handleOnChange}
                                placeholder='Confirm Password'
                            />
                            <span
                            onClick={()=>(setShowConfirmPassword((prev) => !prev))}
                            
                            >
                                {
                                    showPassword ? <IoMdEye fontSize={24} /> : <IoMdEyeOff fontSize={24} />
                                }

                            </span>

                            <button type='submit'>
                                Reset Password
                            </button>
                        </label>
                    </form>
                        <div>
                            <Link to="/login">
                                <p>Back to Login</p>

                            </Link>
                        </div>
                </div>
            )

        }
    </div>
  )
}

export default UpdatePassword