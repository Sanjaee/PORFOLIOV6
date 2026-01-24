import { BiLogoPostgresql } from "react-icons/bi";
import { BsFillBootstrapFill } from "react-icons/bs";
import {
  FaDocker,
  FaPython,
  FaCloudflare,
  FaBitcoin,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  SiCss3,
  SiExpo,
  SiExpress,
  SiFirebase,
  SiFramer,
  SiFlutter,
  SiGithub,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiAndroidstudio,
  SiJsonwebtokens,
  SiKubernetes,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiRabbitmq,
  SiReact,
  SiRedux,
  SiSass,
  SiStorybook,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";

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
  Json: <VscJson size={iconSize} className="text-neutral-700" />,
  RabbitMQ: <SiRabbitmq size={iconSize} className="text-orange-500" />,
  Docker: <FaDocker size={iconSize} className="text-blue-500" />,
  Kotlin: <SiKotlin size={iconSize} className="text-purple-600" />,
  Golang: <SiGo size={iconSize} className="text-cyan-500" />,
  Flutter: <SiFlutter size={iconSize} className="text-blue-400" />,
  "Android Studio": <SiAndroidstudio size={iconSize} className="text-green-600" />,
  "JWT": <SiJsonwebtokens size={iconSize} className="text-pink-500" />,
  Kubernetes: <SiKubernetes size={iconSize} className="text-blue-600" />,
  Python: <FaPython size={iconSize} className="text-yellow-500" />,
  Cloudflare: <FaCloudflare size={iconSize} className="text-orange-500" />,
  Blockchain: <FaBitcoin size={iconSize} className="text-orange-500" />,
  Grpc: <FcGoogle size={iconSize} />,
};
