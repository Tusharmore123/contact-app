import React,{useId} from 'react'

const Input=React.forwardRef(function Input({children,type="text",className="",label,...props},ref) {
    const id=useId();
  return (
   <>
    {label && <label 
        htmlFor={id}
        >
            {label}</label>
            
            
            }
    <input
    type={type}
    className={className}
    ref={ref}
    {...props}
    id={id}
    />
    </>
   
  )
})

export default Input