"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../public/globe.svg";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex justify-between items-center gap-4">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <p className="text-2xl font-semibold text-blue-600">
            Connect Express
          </p>
        </Link>
        <nav className={`md:flex ${isOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col md:flex-row md:space-x-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            {session ? (
              <>
                <li className="flex items-center gap-2">
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span>{session.user.name}</span>
                </li>
                <li>
                  <button onClick={() => signOut()} className="text-blue-600">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => signIn("google")}
                  className="text-blue-600"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </nav>
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
