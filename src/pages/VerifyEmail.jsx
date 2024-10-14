import React, { useEffect, useState } from 'react'
import { FaAmericanSignLanguageInterpreting } from 'react-icons/fa';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { sendOtp, signUp } from "../services/operations/authAPI";


const VerifyEmail = () => {
    const{loading,signupData}=useSelector((state)=>state.auth);
    const[Otp,setOtp]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
      if(!signupData){
        navigate("/signup")
      }
    },[])

    const handleOnSubmit= (e)=>{
      e.preventDefault();

      const {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      }=signupData
    

      dispatch(signUp(accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        Otp,
        navigate
      ));
    }

  return ( 
    <div  className='text-white '>
        {
            loading ? 
            (<div>
                Loading...
            </div>):
            (
               <div className=''>
                    <h1>Verify Email</h1>
                    <p> A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit} className='text-black'>
                         <OTPInput
                          value={Otp}
                          onChange={setOtp}
                          numInputs={6}
                          className="text-black"
                          renderInput={(props) => <input {...props} />}
                         />
                         <button type='submit'>
                            Verify Email
                         </button>
                    </form>
                    <div>
                      <div>
                          <Link to="/login">
                              <p>Back to Login</p>

                          </Link> 
                      </div>
                      <button onClick={()=>{
                        dispatch(sendOtp(signupData.email))
                      }}>
                          Resend 
                      </button>

                    
                    </div>
                    
               </div> 
            )
        }
    </div>
  )
}

export default VerifyEmail