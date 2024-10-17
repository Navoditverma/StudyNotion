import React, { useState } from 'react'
import {VscSettingsGear, VscSignOut} from "react-icons/vsc"
import {logout} from "../../../services/operations/authAPI"
import {sidebarLinks} from "../../../data/dashboard-links"
import { useSelector } from 'react-redux'

const Sidebar = () => {
    const {user, loading: profileLoading }=useSelector((state)=>state.profile);
    const {loading: authLoading}=useSelector((state)=>state.auth);
    if(profileLoading || authLoading){
        return (
            <div className='mt-10'>Loading ....</div>
        )
    }

  return (
    <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800'>

        <div className='flex flex-col '>
            {
                sidebarLinks.map((link,index)=>{
                    if(link.type && user?.accountType !==link.type) return null
                    else{
                        <sidebarLinks key={link.id}  link={link} iconName={link.icon}/>
                    }
                })
            }
        </div>
        <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>

        <div className='flex flex-col'>
            <sidebarLinks link={{name:"Settings", path:"dashboard/settings"}} iconName="VscSettingsGear"/>

            <button
            onClick={()=>{
                text1:"Are You Sure?"
                text2:"You Will be logged out of your Account"
                btn1Text:"Logout"
                btn2Text:"Cancel"
                btn1Handler:()=>dispatch(logout(navigate))
                // btn2Handler:()=> dispatch(l)

                
            }}
            />
        </div>
         

    </div>
  )
}

export default Sidebar