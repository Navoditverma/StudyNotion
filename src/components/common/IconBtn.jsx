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
    className='text-white bg-yellow-50    p-3 rounded-sm'
    disabled={disabled}
    onClick={onclick}
    type={type}>
        {
            children ? (
                <>
                    <span>
                        {text}
                    </span>
                    {children}
                </>
            ) : (text)
        }
    </button>
  )
}

export default IconBtn
