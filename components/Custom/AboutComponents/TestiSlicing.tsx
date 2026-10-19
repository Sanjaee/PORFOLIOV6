import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "../../ui/Image";

export function TestiSlicing() {
  const [selectedImg, setSelectedImg] = useState<{ src: string; title: string } | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <Button
          onClick={() => setSelectedImg({ src: "/slicing1.jpg", title: "Jobpilot — Desktop UI/UX Slicing (Preview 1)" })}
          variant="outline"
          className="bg-transparent z-40 p-2 h-auto hover:bg-zinc-800/30 transition-transform duration-200 hover:scale-105 border-zinc-700/60 shadow-md"
        >
          <Image
            width={260}
            height={160}
            src="/slicing1.jpg"
            alt="slicing 1"
            className="rounded object-cover"
            unoptimized
          />
        </Button>
        <Button
          onClick={() => setSelectedImg({ src: "/slicing2.jpg", title: "Jobpilot — Desktop UI/UX Slicing (Preview 2)" })}
          variant="outline"
          className="bg-transparent z-40 p-2 h-auto hover:bg-zinc-800/30 transition-transform duration-200 hover:scale-105 border-zinc-700/60 shadow-md"
        >
          <Image
            width={260}
            height={160}
            src="/slicing2.jpg"
            alt="slicing 2"
            className="rounded object-cover"
            unoptimized
          />
        </Button>
      </div>

      <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
        <DialogContent className="max-w-[96vw] sm:max-w-[92vw] lg:max-w-6xl w-full max-h-[92vh] p-0 gap-0 border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden [&>button]:top-3 [&>button]:right-3.5 [&>button]:bg-zinc-800/90 [&>button]:hover:bg-zinc-700 [&>button]:text-zinc-200 [&>button]:border [&>button]:border-zinc-700/60 [&>button]:p-1.5 [&>button]:transition-all">
          <DialogTitle className="sr-only">{selectedImg?.title || "UI Slicing Preview"}</DialogTitle>
          <div className="flex items-center justify-between w-full px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/70 pr-12">
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-semibold text-zinc-100">
                {selectedImg?.title || "Jobpilot — Desktop UI/UX Slicing"}
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                React.js &amp; Tailwind CSS
              </span>
            </div>
          </div>
          {selectedImg && (
            <div className="w-full max-h-[84vh] p-2 sm:p-4 overflow-auto flex items-center justify-center bg-black/40">
              <Image
                width={1600}
                height={900}
                src={selectedImg.src}
                alt={selectedImg.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-md border border-zinc-800/50"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
