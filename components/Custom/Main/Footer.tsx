import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center p-4 bg-gray-800 text-white">
      <div>
        <p className="text-sm mb-6">&copy; 2024 Ezadev. All rights reserved.</p>
      </div>
      <div className="flex justify-center items-center mb-4">
        <a
          href="https://www.linkedin.com/in/ahmad-afriza-ab9173276"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 hover:text-gray-400"
        >
          <FaLinkedin size={30} />
        </a>
        <a
          href="https://github.com/Sanjaee"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 hover:text-gray-400"
        >
          <FaGithub size={30} />
        </a>
        <a
          href="https://www.instagram.com/ahmdfrizza"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 hover:text-gray-400"
        >
          <FaInstagram size={30} />
        </a>
        <a
          href="https://www.tiktok.com/@ahmadafriza25?lang=id-ID"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 hover:text-gray-400"
        >
          <FaTiktok size={30} />
        </a>
        <a
          href="https://www.youtube.com/channel/UCGI119S5iGHHMgBXRCKVG8g"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 hover:text-gray-400"
        >
          <FaYoutube size={30} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
