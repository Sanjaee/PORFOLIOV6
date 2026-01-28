"use client";
import { ModeToggle } from "../ui/mode";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { HiCode } from "react-icons/hi";

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
    <nav className="flex shadow-md text-black dark:text-white dark:bg-transparent   fixed top-0 items-center justify-between px-6 sm:px-8 h-16 w-full z-50">
      <NextTopLoader color="#EF4444" showSpinner={false} />
      <Link href="/" aria-label="Home">
        <HiCode className="w-10 h-10" />
      </Link>
      {/* navbar */}
      <div className="sm:flex sm:items-center hidden">
        <ul className="flex items-center mr-5 gap-3 font-bold">
          <li className="hover:text-red-500">
            <Link href="/" aria-label="Home">Home</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/about" aria-label="About">About</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/projects" aria-label="Projects">Projects</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/skills" aria-label="Skills">Skills</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="/saham" aria-label="Saham">Saham</Link>
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
              <Link href="/" onClick={toggleMobileMenu} aria-label="Home">
                Home
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/about" onClick={toggleMobileMenu} aria-label="About">
                About
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/projects" onClick={toggleMobileMenu} aria-label="Projects">
                Projects
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/skills" onClick={toggleMobileMenu} aria-label="Skills">
                Skills
              </Link>
            </li>
            <li className="hover:text-red-500">
              <Link href="/saham" onClick={toggleMobileMenu} aria-label="Saham">
                Saham
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
