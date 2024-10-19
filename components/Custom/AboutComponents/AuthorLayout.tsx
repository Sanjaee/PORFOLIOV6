"use client";
import { useState, useEffect } from "react";
import Image from "../../ui/Image";
import { Teckstack } from "./AccrodionTeckstack";
import { CertiDrawer } from "./CertiDrawer";
import toast, { Toaster } from "react-hot-toast";
import MainLayout from "../MainLayout";
import { Testi } from "./Testi";
import { AccTesti } from "./AccTesti";
import Link from "next/link";
import Embed from "../Main/Tiktok";
import { TestiEnginePlus } from "./TestiEnginePlus";
import { AccEnginePlus } from "./AccEnginePlus";
import TestiEngine from "./TestiEngine";
import { AccSlicing } from "./AccSlicing";
import { TestiSlicing } from "./TestiSlicing";
import { HiCode } from "react-icons/hi";

export default function AuthorLayout({ children }: any) {
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPassword = localStorage.getItem("savedPassword");
    const savedTime = localStorage.getItem("savedTime");

    if (savedPassword && savedTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(savedTime, 10);

      // Check if the saved password is within 24 hours
      if (timeDifference <= 24 * 60 * 60 * 1000 && savedPassword === "Ev9SH4") {
        setOpen(false);
        toast.success("Welcome back!");
      } else {
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("savedTime");
      }
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const staticPassword = "Ev9SH4"; // Set your static password here

    if (password === staticPassword) {
      const currentTime = new Date().getTime();
      localStorage.setItem("savedPassword", password);
      localStorage.setItem("savedTime", currentTime.toString());

      setOpen(false);
      setError("");
      toast.success("Password correct!");
    } else {
      toast.error("Incorrect password. Please try again.");
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {open ? (
        <>
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black  z-40">
            <div className="mb-10 text-center font-bold px-4">
              <p className="text-black  dark:text-white">
                This page contains sensitive data. To request access, please
                contact Me or take the password on my CV:
              </p>
              <p className="text-blue-500 mt-3 ">afrizaahmad18@gmail.com</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex dark:bg-white border border-black text-black  dark:text-black rounded-md p-6 flex-col items-center"
            >
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block  text-lg font-medium "
                >
                  Enter Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-64 px-3 py-2 border dark:bg-white border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <button
                type="submit"
                className="px-4 py-2 hover:bg-gray-800 hover:text-white  mt-4 dark:bg-white   rounded-md shadow-sm dark:hover:bg-black border border-gray-800 font-bold focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>
        </>
      ) : (
        <MainLayout>
          <div className="pt-28 px-2">
            <div className="mb-8 flex flex-col-reverse items-center justify-between sm:flex-row sm:items-center">
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-bold md:text-3xl lg:text-4xl mt-4">
                  Ahmad Afriza
                </h1>
                <h2 className="text-sm font-normal md:text-base">
                  Frontend Engineer
                </h2>
              </div>
              <div>
                <Image
                  alt="Ahmad Afriza"
                  height={130}
                  width={130}
                  src="/profile.png"
                  className="rounded-full object-scale-down "
                />
              </div>
            </div>

            <div className="prose max-w-none pb-8 text-justify text-sm dark:prose-dark md:text-lg xl:col-span-2">
              <p className="mt-4 text-sm">
                My name is Ahmad Afriza, a Software Developer specializing in
                Frontend Development. I have 3 months of experience as a
                freelance web developer, along with 1 year of building personal
                projects. My tech stack includes React.js, Node.js (with
                Express.js), and Next.js. I am passionate about creating
                intuitive and user-friendly interfaces while ensuring smooth
                integration with backend systems. I excel at slicing UI from
                Figma into functional web components.
              </p>

              <h1 className="mt-4 text-2xl font-bold">Education</h1>
              <div className="mt-4 flex flex-col">
                <h2 className="text-lg font-bold">SMAS Harapan Jaya</h2>
                <p className="text-sm mt-2">IPA (Science major)</p>
                <p className="text-sm mt-2">2021 - 2024</p>
              </div>

              <h1 className="mt-4 text-2xl font-bold">Experience</h1>
              <div className="mt-4 flex  items-start">
                <Image
                  width={50}
                  height={50}
                  src="/harisenin.png"
                  alt="harisenin"
                />
                <div className="ml-4 flex flex-col">
                  <p className="text-lg font-bold">Full-stack Web Developer </p>
                  <p className="text-sm">Harisenin.com · Magang</p>
                  <p className="text-sm">Jan 2024 - Jan 2024 · 1 months</p>
                  <p className="text-sm">Jarak jauh</p>
                </div>
              </div>
              <div className="xl:ml-16 mt-6  flex flex-col">
                <p className="text-sm">
                  Fullstack Web Developer at hariSenin.com, contributing
                  expertise over 3 weeks. Spearheading the development of
                  innovative web solutions, from design to implementation.
                  Proficient in integrating cutting-edge technologies to create
                  engaging user experiences. Specialized in maintaining and
                  enhancing the platform, boosting efficiency and performance.
                  Collaborating seamlessly with multidisciplinary teams to
                  achieve project objectives.
                </p>
              </div>
              <p className="text-center mt-4">
                Click on the image below to see more clearly
              </p>
              <div className=" my-20 flex w-full justify-center items-center">
                <CertiDrawer />
              </div>

              <Teckstack />

              <div className="mt-8 flex  items-start">
                <Image
                  width={50}
                  height={50}
                  src="/freelance.png"
                  alt="harisenin"
                />
                <div className="ml-4 flex flex-col">
                  <p className="text-lg font-bold">Full-stack Web Developer </p>
                  <p className="text-sm">Nusantara Pedia · Freelance</p>
                  <p className="text-sm">Jul 2024 - Aug 2024 · 2 months</p>
                  <p className="text-sm">Jarak jauh</p>
                </div>
              </div>
              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">
                  Contributed as a Full-stack Web Developer for Nusantara Pedia
                  in a freelance role. Over 2 months, delivered remote projects
                  by converting existing Figma designs into responsive web
                  applications, using React.js for the frontend and Laravel with
                  Filament for the backend and admin dashboard. Played a key
                  role in coding and implementing solutions that improved user
                  experience and system performance.
                </p>
              </div>

              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">Project Result :</p>
                <Link
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://nusantarapedia.org"
                >
                  https://nusantarapedia.org
                </Link>
                <Link
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700 mt-2"
                  href="https://demo.nusantarapedia.org"
                >
                  https://demo.nusantarapedia.org
                </Link>
                <p className="text-sm mt-5 ">Design Figma :</p>
                <Link
                  target="_blank"
                  className=" underline text-blue-500 hover:text-blue-700"
                  href="https://www.figma.com/design/b9Zt3q1axJFzJTpWLr9B3a/Pariwisata-Universitas-Pancasila"
                >
                  Click to Link Figma
                </Link>
              </div>
              <p className="text-center mt-4">
                Click on the image below to see more clearly
              </p>
              <div className=" my-20 flex w-full justify-center items-center">
                <Testi />
              </div>

              <AccTesti />

              <div className="mt-8 flex  items-start">
              <HiCode className="w-10 h-10" />
                <div className="ml-4 flex flex-col">
                  <p className="text-lg font-bold">FrontEnd Web Developer </p>
                  <p className="text-sm">Personal · Freelance</p>
                  <p className="text-sm">Aug 2024 - Aug 2024 · 3 day</p>
                  <p className="text-sm">Jarak jauh</p>
                </div>
              </div>
              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">
                  Responsible for slicing the desktop UI/UX designs from Figma
                  into responsive web pages using React.js and Tailwind CSS.
                  Focused on implementing pixel-perfect layouts specifically for
                  desktop screens, ensuring cross-browser compatibility. Worked
                  closely with designers to preserve the original design
                  fidelity and develop reusable components tailored for desktop
                  views.
                </p>
              </div>

              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">Project Result :</p>
                <Link
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://ui-ecru.vercel.app"
                >
                  https://ui-ecru.vercel.app
                </Link>

                <p className="text-sm mt-5 ">Design Figma :</p>
                <Link
                  target="_blank"
                  className=" underline text-blue-500 hover:text-blue-700"
                  href="https://www.figma.com/design/KeNb8OFi8LXRK1oNgziiY8/Jobpilot---Job-Portal-Figma-UI-Template-(Community)-(Community)?node-id=1647-26119&node-type=canvas&t=m8BYP0mm2tJdluP2-0"
                >
                  Click to Link Figma
                </Link>
              </div>
              <p className="text-center mt-4">
                Click on the image below to see more clearly
              </p>
              <div className=" my-20 flex w-full justify-center items-center">
                <TestiSlicing />
              </div>

              <AccSlicing />

              <div className="mt-8 flex  items-start">
                <Image
                  width={50}
                  height={70}
                  className="bg-white rounded-full p-1"
                  src="/logo-engineplus.png"
                  alt="harisenin"
                />
                <div className="ml-4 flex flex-col">
                  <p className="text-lg font-bold">Full-stack Web Developer </p>
                  <p className="text-sm">Engineplus Motorsports · Freelance</p>
                  <p className="text-sm">Aug 2024 - Okt 2024 · 2 months</p>
                  <p className="text-sm">Hybrid</p>
                </div>
              </div>
              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">
                  Contributed As a Full-stack Web Developer at Engineplus
                  Motorsports, I was responsible for developing a financial data
                  and invoice system for dealerships, using CodeIgniter 3,
                  jQuery, and Bootstrap. The project involved designing and
                  implementing an efficient financial workflow with features
                  such as transaction tracking, automated invoice management,
                  and detailed financial reporting. I also ensured that the user
                  interface was intuitive, making it easier for dealerships to
                  manage their financial data quickly and accurately.
                </p>
              </div>

              <div className="xl:ml-16 mt-6 flex flex-col">
                <p className="text-sm">Project Result :</p>
                <Link
                  target="_blank"
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://github.com/Sanjaee/ENGINEPLUS-MOTORSPORT.git"
                >
                  https://github.com/Sanjaee/ENGINEPLUS-MOTORSPORT.git
                </Link>
                <div className="flex items-center mt-3">
                  <p className="text-sm font-bold animate-blink">
                    Strictly Prohibited: Duplicating or Selling Code — Offenders
                    Will Face Serious Consequences
                  </p>
                  <svg
                    className="w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#f50505"
                      d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-center mt-4">
                Click on the image below to see more clearly
              </p>
              <div className=" my-20 flex w-full justify-center items-center">
                <TestiEngine />
              </div>

              <AccEnginePlus />
            </div>

            {/* <Embed /> */}
          </div>
        </MainLayout>
      )}
    </>
  );
}
