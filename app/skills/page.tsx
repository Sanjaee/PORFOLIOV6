import Image from "./Image";
import skillsData from "../../components/skillsData.json"; // Adjust the path as needed
import MainLayout from "@/components/Custom/MainLayout";

const Skills = () => {
  return (
    <MainLayout>
      <div className="px-8 sm:px-5 mt-28 w-full pb-10 ">
        <h1 className="text-3xl font-extrabold  text-gray-900 dark:text-gray-100 sm:text-4xl  md:text-5xl ">
          Skills
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-9 mt-10 w-full ">
          {skillsData.map((skill) => (
            <div
              key={skill.id}
              className="w-full  hover:scale-105 rounded-xl shadow-md  dark:bg-neutral-800"
            >
              <Image
                width={1000}
                height={1000}
                className="rounded-t-xl object-cover "
                alt={skill.title}
                src={skill.image}
              />
              <div className="my-4 px-3">
                <h2 className="text-xl font-bold">{skill.title}</h2>
                <p className="text-sm mt-3">{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Skills;
