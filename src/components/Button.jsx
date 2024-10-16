import React from 'react'

//general button
//children is a text
//...props for other atributes given user
function Button({
    children,
    type='button',
    bgColor='bg-blue-600',
    textColor='text-white',
    className='',
    ...props
}) {
  return (
    <button 
    className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props} >
      {children}
    </button>
  )
}

export default Button;