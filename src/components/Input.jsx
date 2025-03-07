import React,{useId} from 'react'

//general input box
//forwardRef is used for handling state of input box from login page
const Input = React.forwardRef(function Input({
    label,
    type="text",
    className="",
    ...props
}, ref) {
    const id=useId();
  return (
    <div className='w-full'>
        {/* label */}
        {label && <label 
        className='inline-block mb-1 pl-1'
        htmlFor={id}>
            {label}
        </label>}
        {/* input box */}
        <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        ref={ref}
        {...props}
        id={id}
        />

    </div>
  )
})

export default Input