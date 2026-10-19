import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "../../ui/Image";

export function CertiDrawer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent z-40 p-2 h-auto hover:bg-zinc-800/30 transition-transform duration-200 hover:scale-105 border-zinc-700/60 shadow-md"
        >
          <Image
            width={260}
            height={160}
            src="/certi1.jpg"
            alt="Harisenin Certificate"
            className="rounded object-cover"
            unoptimized
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[96vw] sm:max-w-[92vw] lg:max-w-6xl w-full max-h-[92vh] p-0 gap-0 border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden [&>button]:top-3 [&>button]:right-3.5 [&>button]:bg-zinc-800/90 [&>button]:hover:bg-zinc-700 [&>button]:text-zinc-200 [&>button]:border [&>button]:border-zinc-700/60 [&>button]:p-1.5 [&>button]:transition-all">
        <DialogTitle className="sr-only">Harisenin.com Certificate Preview</DialogTitle>
        <div className="flex items-center justify-between w-full px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/70 pr-12">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold text-zinc-100">
              Harisenin.com — Certificate of Participant
            </span>
            <span className="hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Full-Stack Web Developer
            </span>
          </div>
        </div>
        <div className="w-full max-h-[84vh] p-2 sm:p-4 overflow-auto flex items-center justify-center bg-black/40">
          <Image
            width={1600}
            height={900}
            src="/certi1.jpg"
            alt="Harisenin Certificate Preview"
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-md border border-zinc-800/50"
            unoptimized
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
