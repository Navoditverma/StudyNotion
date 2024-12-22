import React, { useEffect, useState } from 'react'
import { useParams, } from 'react-router-dom';
import { categories } from '../services/api';
import {getCatalogPageData} from "../services/operations/pageAndComponentData"
import { apiConnector  } from '../services/apiConnector';
import { useSelector } from 'react-redux';
import CourseSlider from "../components/core/Catalog/CourseSlider"
import Course_Card from "../components/core/Catalog/Course_Card"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
    const {catalogName}=useParams();
    const [catalogPageData,setCatalogPageData]=useState(null);
    const [categoryId,setCategoryId]=useState();
    let count=1;


    // Fetch all categoris
    useEffect(()=>{

        const getCategories=async()=>{
            const res=await apiConnector("GET",categories.CATEGORIES_API)
            console.log("categories call number = ",count++,res)
            const category_id = res?.data?.data?.find(
                (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
            )?._id;

            setCategoryId(category_id)


        }
        getCategories();
    },[catalogName])
    useEffect(()=>{
        if (!categoryId) return;
        const getCategoryDetails=async() =>{
            try{
                console.log("id in catalog ",categoryId)
                const res=await getCatalogPageData(categoryId);
                console.log("Result",res)
                setCatalogPageData(res);
                
            }
            catch(error){
                console.log(error);
            }
        }
        getCategoryDetails()

    },[categoryId])




  return (
    <div className='text-white '>
        <div>
            <p> {`Home / Catalog /`}
                <span>{catalogPageData?.data?.selectedCategory?.name}</span>
            </p>
            <p>
                <span>{catalogPageData?.data?.selectedCategory?.name}</span>
            </p>
            <p>
                <span>{catalogPageData?.data?.selectedCategory?.description}</span>
            </p>
        </div>
        <div>
            {/* section 1 */}
            <div>
                <div>
                    <p>Most Popular</p>
                    <p>New</p>
                </div>
                <div>
                     <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
                </div>
               
            </div> 
            {/* secion 2 */}
            <div>
                <p>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>

            {/* Section 3 */}
            <div>
                <p>Frequently Bought</p>
                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData?.data?.mostSellingCourses
                            ?.map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[400px]"} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        {/* <Footer/> */}
    </div>
  )
}

export default Catalog