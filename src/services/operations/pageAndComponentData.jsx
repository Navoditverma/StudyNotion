import React from 'react' 
import {toast} from "react-hot-toast"
import {apiConnector} from "../apiConnector"
import { catalogData } from '../api'
export const getCatalogPageData = async(categoryId) => {
    let result=[];
    const toastId=toast.loading("Loading...")
    try{
        console.log("id",categoryId)
        const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,{categoryId: categoryId})
        console.log("resopse from p & C",response)
        if(!response?.data?.success){
            throw new Error("Could not Fetch Category Data")

        }
        result=response?.data
        console.log("setted",result)
        
    }
    catch(error){
        console.log("Catalog page data api error",error);
        toast.error(error.message)
        result=error.response?.data
    }
    toast.dismiss(toastId);
    return result;
  
}

