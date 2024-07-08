"use client";
import React, { useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import PasswordModal from "./PasswordModal"; // Adjust the import path if necessary

const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLinkedInClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
    window.location.href = "https://www.linkedin.com/in/ahmad-afriza-ab9173276";
  };

  return (
    <footer className="flex w-full relative flex-col items-center p-4 bg-gray-800 text-white">
      <div>
        <p className="text-sm mb-6">&copy; 2024 Ezadev. All rights reserved.</p>
      </div>
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={handleLinkedInClick}
          className="mx-4 hover:text-gray-400"
        >
          <FaLinkedin size={30} />
        </button>
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
      {isModalOpen && (
        <PasswordModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </footer>
  );
};

export default Footer;
