"use client";

import { motion } from "framer-motion";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { ScrollContext } from "../../Custom/ScrollProvider";
import { renderCanvas } from "../../Custom/renderCanvas";
import { BiSolidDownload } from "react-icons/bi";
import MainLayout from "../MontionLayout";
import PasswordModal from "./PasswordModal"; // Import the PasswordModal component

export default function Hero(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useContext(ScrollContext);
  const [isModalOpen, setModalOpen] = useState(false);

  let progress = 0;
  const { current: elContainer } = ref;

  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  useEffect(() => {
    renderCanvas();
  }, []);

  const handleDownloadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
    window.location.href =
      "https://drive.google.com/file/d/1MrwSbkAIzHQQrSw00i81L9ihVUZVOJyo/view?usp=drive_link";
  };

  return (
    <div id="home">
      <div className="relative mt-28 z-10 flex h-[calc(100vh-81px)] items-center md:h-[calc(100vh-116px)]">
        <div className="mx-auto w-screen max-w-3xl px-4 sm:px-9 xl:max-w-5xl xl:px-0">
          <MainLayout>
            <div >
              <div ref={ref} className="flex cursor-default flex-col space-y-2">
                <h1 className="text-5xl font-semibold sm:text-5xl md:text-6xl xl:text-9xl">
                  Ahmad Afriza
                </h1>
                <h2 className="text-3xl font-medium opacity-80 sm:text-xl md:text-5xl xl:text-7xl">
                  I build things for Frontend and Backend.
                </h2>
                <button
                  onClick={handleDownloadClick}
                  className="flex items-center border border-gray-600 rounded-md w-40 hover:text-red-500 px-2 py-2"
                >
                  <p> Download CV</p>
                  <BiSolidDownload size={30} className="download-icon" />
                </button>
              </div>
              <motion.div
                animate={{
                  transform: `translateY(${progress * 10}vh)`,
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 transform md:bottom-8"
              >
                <div
                  role="presentation"
                  className="flex cursor-pointer flex-col items-center justify-center"
                  onClick={() => {
                    const intro = document.querySelector("#intro");
                    intro?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <HiOutlineArrowNarrowDown size={20} />
                </div>
              </motion.div>
            </div>
          </MainLayout>
        </div>
      </div>
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0"
        id="canvas"
      ></canvas>
      {isModalOpen && (
        <PasswordModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
