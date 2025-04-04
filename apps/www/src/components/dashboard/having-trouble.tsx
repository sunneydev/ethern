"use client";

import { Textarea } from "~/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "~/ui/dialog";

export function HavingTrouble() {
  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-md text-white/50">Having trouble?</p>
      </DialogTrigger>
      <DialogContent className="mx-auto w-full max-w-screen-sm overflow-hidden bg-black">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Having trouble?</h2>
          <Textarea></Textarea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
