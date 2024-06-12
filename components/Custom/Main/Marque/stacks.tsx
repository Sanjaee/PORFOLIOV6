import { BiLogoPostgresql } from "react-icons/bi";
import { BsFillBootstrapFill } from "react-icons/bs";
import {
  SiCss3,
  SiExpo,
  SiExpress,
  SiFirebase,
  SiFramer,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiReact,
  SiRedux,
  SiSass,
  SiStorybook,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";

type stacksProps = {
  [key: string]: JSX.Element;
};

const iconSize = "100%";

export const STACKS: stacksProps = {
  JavaScript: <SiJavascript size={iconSize} className="text-yellow-400" />,
  TypeScript: <SiTypescript size={iconSize} className="text-blue-400" />,
  "Next.js": <SiNextdotjs size={iconSize} />,
  "React.js": <SiReact size={iconSize} className="text-sky-500" />,
  TailwindCSS: <SiTailwindcss size={iconSize} className="text-cyan-300" />,
  Bootstrap: (
    <BsFillBootstrapFill size={iconSize} className="text-purple-500" />
  ),
  Vite: <SiVite size={iconSize} className="text-purple-500" />,
  PostgreSql: <BiLogoPostgresql size={iconSize} className="text-blue-400" />,
  "React Native": <SiReact size={iconSize} className="text-sky-600" />,
  Expo: <SiExpo size={iconSize} />,
  SASS: <SiSass size={iconSize} className="text-pink-600" />,
  Firebase: <SiFirebase size={iconSize} className="text-yellow-500" />,
  "Framer Motion": <SiFramer size={iconSize} />,
  "Express.js": <SiExpress size={iconSize} />,
  Redux: <SiRedux size={iconSize} className="text-purple-500" />,
  HTML: <SiHtml5 size={iconSize} className="text-orange-500" />,
  CSS: <SiCss3 size={iconSize} className="text-blue-500" />,
  Prisma: <SiPrisma size={iconSize} className="text-teal-500" />,
  "Node JS": <SiNodedotjs size={iconSize} className="text-green-600" />,
  Github: <SiGithub size={iconSize} />,
  Storybook: <SiStorybook size={iconSize} className="text-pink-500" />,
  Json: <SiJson className="text-neutral-700" />,
};
