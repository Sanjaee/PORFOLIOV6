"use client";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 sm:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
        <div
          className={`md:flex ${
            isOpen ? "block" : "hidden"
          } absolute md:static top-0 left-0 w-full h-full bg-gray-800 md:bg-transparent`}
        >
          <ul className="md:flex md:items-center md:space-x-6 text-white p-8 md:p-0">
            <li className="mt-6 md:mt-0">
              <a href="#" className="block" aria-label="Home">
                Home
              </a>
            </li>
            <li className="mt-6 md:mt-0">
              <a href="#" className="block" aria-label="About">
                About
              </a>
            </li>
            <li className="mt-6 md:mt-0">
              <a href="#" className="block" aria-label="Services">
                Services
              </a>
            </li>
            <li className="mt-6 md:mt-0">
              <a href="#" className="block" aria-label="Contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMobile;
