import React from 'react'

const IconBtn = ({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
}) => {
  return (
    <button 
    className={`flex items-center ${
          outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
        } cursor-pointer gap-x-2 rounded-md py-2 px-5  text-richblack-900 ${customClasses}`}
    disabled={disabled}
    onClick={onclick}
    type={type}>
        {
            children ? (
                <>
                    {children}
                    <span className={`${outline && "text-yellow-50"}`}>
                        {text}
                    </span>
                    
                </>
            ) : (text)
        }
    </button>
  )
}

export default IconBtn
