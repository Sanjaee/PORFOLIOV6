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
        <DialogContent className="max-w-[96vw] sm:max-w-[92vw] lg:max-w-6xl w-full max-h-[92vh] p-0 gap-0 border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden [&>button]:top-3 [&>button]:right-3.5 [&>button]:bg-zinc-800/90 [&>button]:hover:bg-zinc-700 [&>button]:text-zinc-200 [&>button]:border [&>button]:border-zinc-700/60 [&>button]:p-1.5 [&>button]:transition-all">
          <DialogTitle className="sr-only">{selectedSkill?.title}</DialogTitle>
          <div className="flex items-center justify-between w-full px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/70 pr-12">
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-semibold text-zinc-100">
                {selectedSkill?.title}
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedSkill?.description}
              </span>
            </div>
          </div>
          {selectedSkill && (
            <div className="w-full max-h-[84vh] p-2 sm:p-4 overflow-auto flex items-center justify-center bg-black/40">
              <Image
                width={1600}
                height={900}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-md border border-zinc-800/50"
                alt={selectedSkill.title}
                src={selectedSkill.image}
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Skills;
