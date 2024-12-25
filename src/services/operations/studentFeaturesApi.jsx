import { current } from "@reduxjs/toolkit";
import {studentEndpoints} from "../api"
import {toast} from "react-hot-toast";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import {apiConnector} from "../apiConnector"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API,SEND_PAYMENT_SUCCESS_EMAIL_API,COURSE_VERIFY_API}=studentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script=document.createElement("script");
        script.src=src;

        script.onload=()=>{
            resolve(true);

        }
        script.onerror=()=>{
            resolve(false);

        }
        document.body.appendChild(script)
    })

}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId=toast.loading("Loading...");
    try{
        //load sctipt
        console.log("CHECKPOINT 1")
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("Razorpay SDK failed")
            return;
        }
        console.log("CHECKPOINT 2")

        const orderResponse=await apiConnector('POST',COURSE_PAYMENT_API,
                                                        {courses},
                                                        {
                                                            Authorization:`Bearer ${token}`
                                                        }
        )
        console.log("CHECKPOINT 3",orderResponse)

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            description: "Thank You for Pu rchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) {
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token );
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        
        const paymentObject= new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment failed",function(response){
            toast.error("OPs , payment failed")
            console.log(response.error)
        })

    }
    catch(err){
        console.log('Payment api errro',err);
        toast.error("could not make payment");

    }
    toast.dismiss(toastId);
}
async function sendPaymentSuccessEmail(response,amount,token){
     try{
        console.log("SP 1")
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,
        },{
            Authorization:`Bearer ${token}`
        })
     }
     catch(err){
        console.log("Payment success email error..",err)
     }
}

async function verifyPayment(bodyData,token,navigate, dispatch){
    const toastId=toast.loading("Verify Payment...");
    dispatch(setPaymentLoading(true));
    try{
        console.log("Verfiying payment")
        const response=await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization:`Bearer ${token}`

        })
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("payment Successfull , you are addeded to the course")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(err){
        console.log("payment verify error ", err);
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));



      

}