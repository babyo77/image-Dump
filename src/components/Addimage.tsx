import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { RiImageAddLine } from "react-icons/ri";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { confettiAnimation } from "./ui/confettiAnimation";
import { database } from "@/lib/client/appwrite";
import { ID } from "appwrite";
import { useUserContext } from "@/store/context";
import { gallery } from "@/app/types/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { Input } from "./ui/input";
import { isValidURL } from "@/lib/utils";
const ImageGallery = forwardRef<HTMLButtonElement, {}>(({}, ref) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImage, setImage] = useState<File | null>(null);
  const imageRef = useRef<string>("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const { user, gallery, setGallery } = useUserContext();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    let image: FileList | null = null;

    if ("files" in e.target) {
      image = e.target.files;
    } else if ("dataTransfer" in e) {
      image = e.dataTransfer.files;
    }

    if (image && image.length === 1) {
      const file = image[0];
      const maxSize = 7 * 1024 * 1024;

      if (file.size <= maxSize) {
        if (file.type.startsWith("image")) {
          setImage(file);
          imageRef.current = URL.createObjectURL(file);
        } else {
          toast.error("Invalid image");
        }
      } else {
        toast.error("File size exceeds 7 MB");
      }
    }
  };
  const linkRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async () => {
    if (selectedImage && user) {
      setUploading(true);
      const formData = new FormData();
      const link = linkRef.current;
      if (link && link.value.length > 0 && !isValidURL(link.value))
        return toast.error("invalid URL");
      formData.append(
        "payload_json",
        JSON.stringify({
          upload_source: "dashboard",
          domain: "the-chiefly-lasagna.tixte.co",
          type: 1,
          name: selectedImage.name,
        })
      );
      formData.append("file", selectedImage);
      let delUrl = "https://example.com";
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data: {
            data: { deletion_url: string; direct_url: string };
            features: string;
          } = await response.json();
          delUrl = data.data.deletion_url;
          const update = await database.getDocument(
            process.env.DATABASE_ID || "",
            process.env.USERS_ID || "",
            user.$id
          );
          const newImage: gallery = await database.createDocument(
            process.env.DATABASE_ID || "",
            process.env.GALLERY_ID || "",
            ID.unique(),
            {
              data: data.data.direct_url,
              del: data.data.deletion_url,
              type: "image",
              for: user.$id,
              link: link?.value,
              features: data.features,
              index: user.usersDoc.galleryTotal + 1,
              users: [user.$id],
              tags: [],
            }
          );
          await database.updateDocument(
            process.env.DATABASE_ID || "",
            process.env.USERS_ID || "",
            user.$id,
            {
              galleryTotal: update.galleryTotal + 1,
            }
          );

          setGallery([newImage, ...(gallery || [])]);
          if (closeRef.current) closeRef.current.click();
          setImage(null);
          confettiAnimation();
        }
      } catch (error) {
        fetch(delUrl);
        //@ts-expect-error:expected error
        toast.error(error.message);
      } finally {
        setUploading(false);
      }
    }
  }, [selectedImage, user, setGallery, gallery]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger ref={ref}></DialogTrigger>
        <DialogContent className="w-[40dvw] rounded-xl ">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
            <DialogDescription></DialogDescription>
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.4 }}
              className=" flex flex-col gap-4"
            >
              <input
                onChange={handleChange}
                type="file"
                name="galleryImage"
                disabled={uploading}
                hidden
                accept="image/*"
                id="galleryImage"
              />

              <label
                draggable
                htmlFor="galleryImage"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleChange}
              >
                <div className="border mt-1.5 opacity-95 cursor-pointer leading-tight w-full gap-1 flex-col h-48 border-dashed  rounded-sm flex items-center justify-center">
                  {selectedImage && imageRef.current ? (
                    <Image
                      height={500}
                      width={500}
                      alt="image"
                      className=" h-[100%] w-[100%] object-contain py-2"
                      src={imageRef.current}
                    />
                  ) : (
                    <>
                      <div className=" border p-2 rounded-md">
                        <RiImageAddLine className="h-5 w-5" />
                      </div>
                      <div className=" text-center">
                        <span className="text-sm text-zinc-200">
                          Drag an image
                        </span>
                        <p className=" text-zinc-400 text-xs">
                          Select a image or drag here to upload directly
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
              <Input
                placeholder="Custom Redirect Link (optional)"
                type="text"
                ref={linkRef}
              />
              {/* <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add to collection (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select> */}

              <DialogClose ref={closeRef} className=""></DialogClose>
              <Button
                variant={"secondary"}
                disabled={uploading}
                onClick={handleUpload}
                className="-mt-4"
              >
                {uploading ? (
                  <Loader className=" animate-spin h-5 w-5" />
                ) : (
                  "Upload"
                )}
              </Button>
            </motion.div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger ref={ref}></DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>
            <div className=" flex justify-between items-center w-full">
              <p className="text-zinc-400 tex-xs font-medium">
                <DrawerClose
                  ref={closeRef}
                  className="text-base hover:text-zinc-100"
                >
                  Cancel
                </DrawerClose>
              </p>
              <p> Upload</p>
              <p className="text-zinc-400 tex-xs font-medium">
                <Button
                  variant={"secondary"}
                  disabled={uploading}
                  onClick={handleUpload}
                  className="bg-transparent m-0 w-[3.4rem] flex justify-end items-end  hover:bg-transparent hover:text-zinc-100 text-zinc-400 px-0 text-base"
                >
                  {uploading ? (
                    <Loader className=" animate-spin h-5 w-5" />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </p>
            </div>
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.4 }}
            className=" flex flex-col gap-4"
          >
            <input
              onChange={handleChange}
              type="file"
              name="galleryImage"
              disabled={uploading}
              hidden
              accept="image/*"
              id="galleryImage"
            />

            <label
              draggable
              htmlFor="galleryImage"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleChange}
            >
              <div className="border opacity-95 cursor-pointer leading-tight w-full gap-1 flex-col h-48 border-dashed  rounded-sm flex items-center justify-center">
                {selectedImage && imageRef.current ? (
                  <Image
                    height={500}
                    width={500}
                    alt="image"
                    className=" h-[100%] w-[100%] object-contain py-2"
                    src={imageRef.current}
                  />
                ) : (
                  <>
                    <div className=" border p-2 rounded-md">
                      <RiImageAddLine className="h-5 w-5" />
                    </div>
                    <div className=" text-center">
                      <p className=" text-zinc-400 pt-1 text-xs">
                        Select a image to upload
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>
            <Input
              placeholder="Custom Redirect Link (optional)"
              type="text"
              ref={linkRef}
            />
            {/* <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add to collection (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select> */}
          </motion.div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
});
ImageGallery.displayName = "ImageGallery";

export default ImageGallery;
