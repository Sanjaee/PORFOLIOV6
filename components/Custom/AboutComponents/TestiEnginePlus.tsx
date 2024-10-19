import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "../../ui/Image";

export function TestiEnginePlus() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent z-40 h-full">
          {" "}
          <Image
            width={200}
            height={200}
            src="/testi3.jpg"
            alt="testi"
            className="mt-4"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="justify-center flex items-center">
          <Image
            width={500}
            height={500}
            src="/testi3.jpg"
            alt="testi"
            className="mt-4"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
