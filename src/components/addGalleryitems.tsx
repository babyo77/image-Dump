import { IoMdAdd } from "react-icons/io";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { RiImageAddLine } from "react-icons/ri";
import { Music } from "lucide-react";
import ImageGallery from "./Addimage";
import { useRef } from "react";
import AddMusic from "./addMusic";
function AddGalleryItems() {
  const imageRef = useRef<HTMLButtonElement>(null);
  const musicRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <AddMusic ref={musicRef} />
      <ImageGallery ref={imageRef} />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <div className=" cursor-pointer hover:text-zinc-300 transition-all duration-300">
              <IoMdAdd className="h-5 w-5" />
            </div>
          </MenubarTrigger>
          <MenubarContent className="w-56 mb-3 mr-7 bg-primary-foreground/95 rounded-md">
            <MenubarItem
              onClick={() => imageRef.current && imageRef.current.click()}
            >
              Upload File
              <MenubarShortcut>
                <RiImageAddLine />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={() => musicRef.current && musicRef.current.click()}
            >
              Add music
              <MenubarShortcut>
                <Music className="h-3 w-3" />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
}

export default AddGalleryItems;
