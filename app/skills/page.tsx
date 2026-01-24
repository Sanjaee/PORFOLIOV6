'use client'

import { useState } from "react";
import Image from "./Image";
import skillsData from "../../components/skillsData.json"; // Adjust the path as needed
import MainLayout from "@/components/Custom/MainLayout";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState<typeof skillsData[0] | null>(null);

  return (
    <MainLayout>
      <div className="px-4 sm:px-5 mt-28 w-full pb-10 ">
        <h1 className="text-3xl font-extrabold  text-gray-900 dark:text-gray-100 sm:text-4xl  md:text-5xl ">
          Skills
        </h1>
        <div className="columns-1 sm:columns-2 gap-9 mt-10 w-full">
          {skillsData.map((skill) => (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="break-inside-avoid mb-9 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-xl shadow-md dark:bg-neutral-800 overflow-hidden"
            >
              <Image
                width={1000}
                height={1000}
                className="rounded-t-xl object-cover w-full h-auto"
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

      {/* Dialog/Popup */}
      <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
        <DialogContent className="max-w-[98vw] sm:max-w-[90vw] w-full max-h-[98vh] p-0 sm:p-6 gap-0 sm:gap-4 pr-0 sm:pr-6">
          <DialogTitle className="sr-only">{selectedSkill?.title}</DialogTitle>
          {selectedSkill && (
            <div className="space-y-2 sm:space-y-4">
              <div className="w-full h-auto max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex items-center justify-center">
                <Image
                  width={1200}
                  height={1200}
                  className="w-full h-auto max-h-[85vh] sm:max-h-[80vh] object-contain rounded-none sm:rounded-lg"
                  alt={selectedSkill.title}
                  src={selectedSkill.image}
                />
              </div>
              <div className="px-3 sm:px-0 pb-3 sm:pb-0">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{selectedSkill.title}</h2>
                <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">{selectedSkill.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Skills;
