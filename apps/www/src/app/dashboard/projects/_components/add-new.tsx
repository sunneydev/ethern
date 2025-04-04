import { PlusIcon } from "@radix-ui/react-icons";
import { Onboarding } from "~/components/dashboard/onboarding";
import { Button } from "~/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/ui/dialog";

export function AddNew() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center gap-2 sm:w-36">
          <PlusIcon className="fill-current" />
          <span className="hidden sm:inline-block">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="no-scrollbar h-full w-full overflow-y-scroll bg-black sm:h-fit sm:overflow-hidden">
        <Onboarding label="Publish new project" />
      </DialogContent>
    </Dialog>
  );
}
