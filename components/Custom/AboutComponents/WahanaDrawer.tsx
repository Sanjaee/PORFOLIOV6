import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "../../ui/Image";

export function WahanaDrawer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent z-40 p-2 h-auto hover:bg-zinc-800/20">
          <Image
            width={260}
            height={160}
            src="/wahanacrm.jpg"
            alt="Wahana CRM"
            className="rounded object-cover"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-w-[95vw] p-2 bg-background">
        <div className="justify-center flex items-center p-2">
          <Image
            width={1200}
            height={700}
            src="/wahanacrm.jpg"
            alt="Wahana CRM"
            className="rounded-lg object-contain w-full h-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
