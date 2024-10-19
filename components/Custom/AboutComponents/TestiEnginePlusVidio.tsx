import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "../../ui/Image";

export function TestiEnginePlusVidio() {
  return (
    <Dialog>
    <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent z-40 h-full">
          {" "}
          <Image
            width={500}
            height={500}
            src="/testividio1.png"
            alt="testi"
            className="mt-4"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <div className="justify-center flex items-center">
         <video width={900} height={500} src="https://res.cloudinary.com/dgmlqboeq/video/upload/v1729324168/lv_0_20241019144429_fmowfd.mp4" controls></video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
