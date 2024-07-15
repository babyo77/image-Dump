import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { BiSolidUserVoice } from "react-icons/bi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
function CreateSpace() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const closeRef = useRef<HTMLButtonElement>(null);

  const render = () => {
    return (
      <div className=" space-y-4">
        <Input type="text" placeholder="Space name" />
        <Select defaultValue="public">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Space Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
        <p className="mb-2 text-center text-sm text-neutral-400">
          Start a space, open to everyone
        </p>
        <Button size={"sm"} className="w-full">
          Create Space
        </Button>
      </div>
    );
  };
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            variant={"secondary"}
            className=" flex gap-1 py-5 items-center"
          >
            <BiSolidUserVoice className="h-5 w-5" />
            Create your space
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Space details</DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogClose ref={closeRef} />
          </DialogHeader>
          {render()}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          variant={"secondary"}
          className=" flex gap-1 py-5 items-center"
        >
          <BiSolidUserVoice className="h-5 w-5" />
          Create your space
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Enter Space details</DrawerTitle>
          <DrawerDescription></DrawerDescription>
          {render()}
          <DrawerClose ref={closeRef} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateSpace;
