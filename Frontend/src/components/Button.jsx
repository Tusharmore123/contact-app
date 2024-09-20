import React from 'react'

function Button({
  children,
  className = "",
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "white",
  ...props
}) {
  return (
    <button type={type} className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className} `}{...props}>{children}</button>
  )
}

export default Button