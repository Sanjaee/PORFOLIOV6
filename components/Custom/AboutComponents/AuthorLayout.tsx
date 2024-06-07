import Image from "../../ui/Image";
import { Teckstack } from "./AccrodionTeckstack";
import { CertiDrawer } from "./CertiDrawer";

export default function AuthorLayout({ children }: any) {
  return (
    <div className="pt-8">
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
          front-end and full-stack development. I have hands-on experience with
          Next.js, Express, Prisma ORM, PostgreSQL, MongoDB, and React.js.
          Additionally, I am currently learning backend development with Flask
          Python and Go, as well as the Laravel framework. Moreover, I&apos;m in
          the process of learning message broker systems, including RabbitMQ.
        </p>

        <p className="mt-4 text-sm">
          While I have not yet held a professional position, I am passionate
          about creating beautiful and reusable user interfaces using ReactJS
          and building robust full-stack applications. My technical skill set
          allows me to develop scalable and maintainable code for modern web
          applications.
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
            Fullstack Web Developer at hariSenin.com, contributing expertise
            over 3 weeks. Spearheading the development of innovative web
            solutions, from design to implementation. Proficient in integrating
            cutting-edge technologies to create engaging user experiences.
            Specialized in maintaining and enhancing the platform, boosting
            efficiency and performance. Collaborating seamlessly with
            multidisciplinary teams to achieve project objectives.
          </p>
        </div>
        <div className=" my-20 flex w-full justify-center items-center">
          <CertiDrawer />
        </div>

        <Teckstack />
      </div>
    </div>
  );
}
