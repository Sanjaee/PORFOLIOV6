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
                I am currently an aspiring software developer with expertise in
                front-end and full-stack development. I have hands-on experience
                with Next.js, Express, Prisma ORM, PostgreSQL, MongoDB, and
                React.js. Additionally, I am currently learning backend
                development with Flask Python and Go, as well as the Laravel
                framework. Moreover, I&apos;m in the process of learning message
                broker systems, including RabbitMQ.
              </p>

              <p className="mt-4 text-sm">
                While I have not yet held a professional position, I am
                passionate about creating beautiful and reusable user interfaces
                using ReactJS and building robust full-stack applications. My
                technical skill set allows me to develop scalable and
                maintainable code for modern web applications.
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
                  src="https://media.licdn.com/dms/image/D560BAQH7odxdlnGYNg/company-logo_200_200/0/1706966500193/harisenin_com_logo?e=1725494400&v=beta&t=sxCzM1ibsj5o4X7RhyNRKaqUIOn4Wjwsoj1UWjKySNQ"
                  alt="harisenin"
                />
                <div className="ml-4 flex flex-col">
                  <p className="text-lg font-bold">Full-stack Web Developer </p>
                  <p className="text-sm">Harisenin.com · Magang</p>
                  <p className="text-sm">Jan 2024 - Jan 2024 · 1 bln</p>
                  <p className="text-sm">Jarak jauh</p>
                </div>
              </div>
              <div className="ml-16 mt-6 flex flex-col">
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
                  <p className="text-sm">Jul 2024 - Aug 2024 · 2 bln</p>
                  <p className="text-sm">Jarak jauh</p>
                </div>
              </div>
              <div className="ml-16 mt-6 flex flex-col">
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

              <div className="ml-16 mt-6 flex flex-col">
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
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
}
