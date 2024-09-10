import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "../../ui/Image";
import "driver.js/dist/driver.css";

export function CertiDrawer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent z-40">
          <Image
            width={200}
            height={200}
            src="/certi1.jpg"
            alt="certi"
            className="mt-4"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="justify-center flex items-center">
          <Image
            width={500}
            height={500}
            src="/certi1.jpg"
            alt="certi"
            className="mt-4"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
