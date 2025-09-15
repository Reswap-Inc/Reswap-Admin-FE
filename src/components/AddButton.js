import React from 'react';

const AddButton = ({ children, onClick, className, bgColor = "#00394D", textColor = "white", isMobile = false }) => (
  <button
    onClick={onClick}
    className={`px-3 md:px-6 py-2 rounded-lg hover:opacity-90 flex border-r-4 items-center justify-center ${className}`}
    style={{ 
      backgroundColor: bgColor, 
      color: textColor, 
      fontWeight: "600", 
      textAlign: "center", 
      lineHeight: "1.2",
      borderRadius: "10px",
      fontSize: isMobile ? "0.875rem" : "1rem",
      minWidth: isMobile ? "80px" : "auto"
    }}
  >
    {children}
  </button>
);

export default AddButton;