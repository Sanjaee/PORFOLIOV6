"use client";
import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

const Intro = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="center-bottom"
      className="relative  z-10 bg-black text-white dark:bg-white  dark:text-black"
    >
      <div
        id="intro"
        className="mx-auto flex py-10 max-w-5xl flex-col items-center justify-center px-10 text-4xl font-semibold tracking-tight  md:text-6xl lg:px-20 lg:py-20 lg:text-7xl"
      >
        <div>
          <div className="introText hover:text-gray-400">I love coding.</div>
          <span className="introText inline-block hover:text-gray-400">
            I use my passion and skills to build digital products and
            experiences.
          </span>
          <span className="introText inline-block hover:text-gray-400">
            I&apos;m passionate about cutting-edge, pixel perfect UI and
            intuitively implemented UX.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Intro;
