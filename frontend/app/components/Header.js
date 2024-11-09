// app/components/Header.js
'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBars, FaTimes } from 'react-icons/fa'
import Logo from '../../public/globe.svg'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
            <Image src={Logo} alt="Logo" width={50} height={50} />
            <span className="ml-2 text-xl font-bold text-blue-600">TrainBook</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600" onClick={toggleMenu}>
                  Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-gray-700 hover:text-blue-600" onClick={toggleMenu}>
                  Features
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600" onClick={toggleMenu}>
                  Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
