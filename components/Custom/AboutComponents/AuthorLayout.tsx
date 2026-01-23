"use client";
import Image from "../../ui/Image";
import { Teckstack } from "./AccrodionTeckstack";
import { CertiDrawer } from "./CertiDrawer";
import MainLayout from "../MainLayout";
import { Testi } from "./Testi";
import { AccTesti } from "./AccTesti";
import Link from "next/link";
import Embed from "../Main/Tiktok";
import { AccSlicing } from "./AccSlicing";
import { TestiSlicing } from "./TestiSlicing";
import { HiCode } from "react-icons/hi";

export default function AuthorLayout({ children }: any) {
  return (
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
                Full-stack Development. I have 3 months of experience as a
                freelance web developer, along with 1 year of building personal
                projects. My tech stack includes Next.js for frontend and
                full-stack development, Golang for backend services, Kotlin for
                mobile and backend development, Docker for containerization, and
                RabbitMQ for message queuing. I am passionate about creating
                scalable and efficient applications while ensuring smooth
                integration between frontend and backend systems. I excel at
                building modern web applications with microservices architecture.
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

         
            </div>

            <Embed />
          </div>
    </MainLayout>
  );
}
