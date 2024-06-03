"use client";
import Image from "next/image";
import { ModeToggle } from "../ui/mode";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="flex shadow-md items-center justify-between px-6 sm:px-8 h-16 w-full z-50">
      <NextTopLoader color="#EF4444" showSpinner={false} />
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] light:drop-shadow-[0_0_0.3rem_#00000070] dark:invert"
        width={100}
        height={100}
        src="/next.svg"
        alt="Logo"
      />
      {/* navbar */}
      <div className="sm:flex sm:items-center hidden">
        <ul className="flex items-center mr-5 gap-3 font-bold">
          <li className="hover:text-red-500">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/about">About</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/projects">Projects</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/skills">Skills</Link>
          </li>
        </ul>
        <ModeToggle />
      </div>
      <div className="sm:hidden flex items-center">
        <ModeToggle />
        <button
          onClick={toggleMobileMenu}
          className="ml-4 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden z-50 absolute flex justify-center items-center top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white dark:bg-black shadow-md">
          <ul className="flex flex-col items-center gap-10 p-4 font-bold">
            <li className="hover:text-red-500">
              <Link href="/" onClick={toggleMobileMenu}>
                Home
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/about" onClick={toggleMobileMenu}>
                About
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/projects" onClick={toggleMobileMenu}>
                Projects
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/skills" onClick={toggleMobileMenu}>
                Skills
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
