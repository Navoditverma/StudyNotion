import React, { useEffect, useState } from 'react'
import { Link, Route } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import  NavBarLinks from '../../data/navbar-links'
import { matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/api'
import {IoIosArrowDropdownCircle} from "react-icons/io"


const subLInks=[
    {
        title:"python",
        link:"/catalog/python"
    },
    {
        title:"web development",
        link:"/catalog/web-development"
    }
]
const Navbar = () => { 

    const {token} =useSelector((state)=>state.auth);
    const user= useSelector((state)=> state.profile)
    const {totalItems}= useSelector((state)=> state.cart)
    const location=useLocation()
    
    const [subLinks,setSublinks]=useState([]);

    const fetchSublinks= async() =>{
        try{
            const result= await apiConnector("GET",categories.CATEGORIES_API);
            console.log("Printing Sublinks result:",result);
            setSublinks(result.data.data);


        }
        catch(error){
            console.log("Could not fetch  the category list" + error)

        }
    }

    useEffect(()=>{
        fetchSublinks();
    },[])
    
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname);
    }
    
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 '>
        <div className= 'flex w-11/12 flex-row  max-w-maxContent items-center justify-between  '>
            <Link to="/">
                <img src={logo} width={160} height={32} loading='lazy'/>
            </Link>
            {/* Nav Links */}

            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                {
                    NavBarLinks.map((link,index)=>(
                         <li key={index}>
                            {
                                link.title==="Catalog"? (
                                    <div className='flex items-center gap-2 group relative z-0    '>
                                        {link.title}
                                        <IoIosArrowDropdownCircle />

                                        <div className=' invisible absolute translate-x-[-50%] translate-y-[80%] left-[50%] -top-[90%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100  lg:w-[300px]  '>

                                            <div className='absolute  left-[50%] translate-x-[80%]
                                                translate-y-[-45%]  
                                             top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 '>
                                            </div>
                                            {
                                                subLInks.length? 
                                                (subLInks.map((sublink,index)=>(
                                                    <Link to={`${sublink.link}`} key={index}>
                                                        <p>{sublink.title}</p>
                                                    </Link>
                                                ))):
                                                (<div></div>)
                                            }

                                        </div>

                                        
                                    </div>
                                    ): 
                                ( <Link to={link?.path}>
                                    <p className={matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}>
                                        {link.title}
                                    </p>
                                    </Link>)
                            } 
                        </li>
                    ))
                }

                </ul>
            </nav>

            {/* Login sinup dashboard */}
            <div className='flex gap-x-4 items-center   '>
                {
                    user && user.accountType!=="Instructor" && (   
                        <Link to="/dashboard/cart" className='relative '>
                            <AiOutlineShoppingCart/>
                            {
                                totalItems>0 && (
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                { 
                    token==null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]  text-richblack-100 rounded-md '>
                            Log in
                            </button>
                        </Link>
                    )
                }
                { 
                    token ==null && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]  text-richblack-100 rounded-md '>
                                Sign up
                            </button>
                        </Link>
                    )
                }
                {
                    token!==null && <ProfileDropDown/>
                }

                
            </div>


        </div>
    </div>
  )
}

export default Navbar