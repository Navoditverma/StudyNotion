import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {getPasswordResetToken} from "../services/operations/authAPI"
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    const{loading} =useSelector((state)=> state.auth);
    const dispatch=useDispatch();
    const [emailSent,setEmailSent]=useState(false);
    const [email,setEmail]=useState("");
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));

    }

    return (
        <div className='flex flex-row justify-center items-center text-white '>
            {
                loading ? (<div>Loading...</div>):
                (
                    <div>
                        <h1>
                            {!emailSent ? "Reset Your Password": "Check Your Email"}
                        </h1>
                        <p>
                            {!emailSent?"Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" :
                                `We have sent the reset email to
                                ${email}`}
                        </p>
                        <form onSubmit={handleOnSubmit}>
                            {!emailSent && (
                                <label>
                                    <p>Email Address</p>
                                    <input required 
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder='Enter Your Email Address'/> 
                                </label>

                                )   
                            }
                            <button type="submit">
                                {!emailSent ? "Reset Password": "Resend Email"}
                            </button>
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

export default ForgotPassword