import React from 'react'

const Footer = () => {
    return (
      <footer className="bg-white shadow-inner">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          © {new Date().getFullYear()} TrainBook. All rights reserved.
        </div>
      </footer>
    )
  }
  
  export default Footer
  