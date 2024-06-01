import Image from "next/image";
import { ModeToggle } from "../ui/mode";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex   shadow-md  items-center justify-between px-6 sm:px-8 h-16  w-full z-50 ">
      <NextTopLoader color="#EF4444" showSpinner={false} />
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]  light:drop-shadow-[0_0_0.3rem_#00000070] dark:invert"
        width={100}
        height={100}
        src="./next.svg"
        alt="sdas"
      />
      {/* navbar */}
      <div className="sm:flex sm:items-center hidden ">
        <ul className="flex items-center mr-5 gap-3 font-bold ">
          <li className="hover:text-red-500 ">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-red-500 ">
            <Link href="/about">About</Link>
          </li>
          <li className="hover:text-red-500 ">
            <Link href="/projects">Projects</Link>
          </li>
          <li className="hover:text-red-500 ">
            <Link href="/skills">Skills</Link>
          </li>
        </ul>
        <ModeToggle />
      </div>
      <div className="sm:hidden">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
