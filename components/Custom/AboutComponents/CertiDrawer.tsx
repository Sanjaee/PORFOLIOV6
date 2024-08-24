import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "../../ui/Image";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function CertiDrawer() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const driverObj = driver();
      driverObj.highlight({
        element: "#some-element",

        popover: {
          showButtons: ["close"],

          side: "left",
          title: "Click this",
          description: "to clarify the picture",
        },
      });
    }, 5000); // 2 detik

    // Cleanup untuk mencegah memory leaks
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent z-40">
          <Image
            id="some-element"
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
