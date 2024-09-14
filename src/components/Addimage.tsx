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
import { useUserContext } from "@/store/context";
import { gallery } from "@/app/types/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { Input } from "./ui/input";
import { getRandom, isValidURL } from "@/lib/utils";
const ImageGallery = forwardRef<HTMLButtonElement, {}>(({}, ref) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setFile] = useState<File | null>(null);
  const fileRef = useRef<string>("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const { user, setGallery } = useUserContext();
  const [instaLink, setInstaLink] = useState<string>("");
  const linkRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    if (instaLink.length > 0) return toast.error("Remove instagram link");

    let image: FileList | null = null;

    if ("files" in e.target) {
      image = e.target.files;
    } else if ("dataTransfer" in e) {
      image = e.dataTransfer.files;
    }

    if (image && image.length === 1) {
      const file = image[0];
      const maxSize = file.type.startsWith("video")
        ? 10 * 1024 * 1024
        : 7 * 1024 * 1024;

      if (file.size <= maxSize) {
        if (file.type.startsWith("image") || file.type.startsWith("video")) {
          setFile(file);
          fileRef.current = URL.createObjectURL(file);
        } else {
          toast.error("Invalid file");
        }
      } else {
        if (file.type.startsWith("image")) {
          toast.error("File size exceeds 7 MB");
        } else {
          toast.error("File size exceeds 10 MB");
        }
      }
    }
  };

  const handleUploadHelper = useCallback(
    async (file: File, optionalLink?: string) => {
      if (file && user) {
        setUploading(true);
        const formData = new FormData();
        const link = linkRef.current;
        if (link && link.value.length > 0 && !isValidURL(link.value)) {
          toast.error("Invalid URL");
          setUploading(false);
          return;
        }
        formData.append(
          "payload_json",
          JSON.stringify({
            upload_source: "dashboard",
            domain: "tanmay111-files.tixte.co",
            type: 1,
            name: file.name,
          })
        );
        formData.append("file", file);
        let delUrl = "tanmay111-files.tixte.co";
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            headers: {
              loc: file.type.startsWith("video") ? "i" : "v",
            },
          });
          if (response.ok) {
            const data: {
              data: { deletion_url: string; direct_url: string };
              features: string[];
            } = await response.json();
            delUrl = data.data.deletion_url;

            const image = {
              type: file.type.startsWith("image") ? "image" : "video",
              userId: user._id,
              data: data.data.direct_url,
              del: data.data.deletion_url,
              link: link?.value || optionalLink,
              features:
                data.features.length > 0
                  ? data.features.map((r) => r.toLowerCase())
                  : [],
            };
            const res = await fetch("/api/update", {
              method: "PATCH",
              body: JSON.stringify({ type: "gallery", data: image }),
            });
            const newImage = await res.json();
            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error.message);
            }
            setFile(file);
            fileRef.current = URL.createObjectURL(file);
            setGallery((prev) => [newImage, ...(prev || [])]);
            return newImage;
          } else {
            const res = await response.json();
            throw new Error(res.error.message);
          }
        } catch (error) {
          await fetch(delUrl).catch((e) => console.error(e));
          //@ts-expect-error:expected error
          toast.error(error.message);
        } finally {
          setInstaLink("");
          setUploading(false);
        }
      }
    },
    [user, setGallery]
  );

  const handleInstaUpload = useCallback(async () => {
    setUploading(true);
    try {
      const res = await fetch(
        `https://instx-api.vercel.app/api/v1?link=${instaLink}`
      );
      if (res.ok) {
        const data: { thumbnail_link: string; download_link: string }[] =
          await res.json();

        const uploadPromises = data.map(async (item) => {
          let response = null;
          try {
            response = await fetch(item.download_link);
            if (!response.ok) throw new Error("Failed to fetch directly");
          } catch (error) {
            response = await fetch("https://image-proxy-1a78.onrender.com/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ img: item.download_link }),
            });
            if (!response.ok) {
              toast.error("Failed to fetch via proxy");
              return undefined;
            }
          }

          const blob = await response.blob();
          const fileName = getRandom() + Date.now();
          const file = new File([blob], fileName, { type: blob.type });

          if (file.type.startsWith("image")) {
            if (file.size <= 7 * 1024 * 1024) {
              await handleUploadHelper(file, instaLink);
            } else {
              toast.error("Image size exceeds 7 MB");
              return undefined;
            }
          } else if (file.type.startsWith("video")) {
            if (file.size <= 7 * 1024 * 1024) {
              await handleUploadHelper(file, instaLink);
            } else {
              toast.error("Video size exceeds 7 MB");
              return undefined;
            }
          } else {
            toast.error("Unsupported file type");
            return undefined;
          }
          return true;
        });

        await Promise.all(uploadPromises);

        if (closeRef.current) closeRef.current.click();
      } else {
        toast.error("Failed to fetch Instagram link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  }, [instaLink, handleUploadHelper]);

  const handleUpload = useCallback(async () => {
    if (instaLink.length > 0) {
      if (isValidURL(instaLink)) {
        await handleInstaUpload();
      } else {
        toast.error("Invalid link");
      }
    } else if (selectedFile) {
      await handleUploadHelper(selectedFile);
      if (closeRef.current) closeRef.current.click();
    }
  }, [instaLink, selectedFile, handleInstaUpload, handleUploadHelper]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger ref={ref}></DialogTrigger>
        <DialogContent className="max-w-lg rounded-xl ">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
            <DialogDescription>Analyzed by AI</DialogDescription>
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
                accept="image/*,video/*"
                id="galleryImage"
              />

              <label
                draggable
                htmlFor="galleryImage"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleChange}
              >
                <div className="border mt-1.5 opacity-95 cursor-pointer leading-tight w-full gap-1 flex-col h-48 border-dashed  rounded-sm flex items-center justify-center">
                  {selectedFile && fileRef.current ? (
                    <>
                      {selectedFile.type.startsWith("image") ? (
                        <Image
                          height={500}
                          width={500}
                          alt="image"
                          className=" h-[100%] w-[100%] object-contain py-2"
                          src={fileRef.current}
                        />
                      ) : (
                        <video
                          height={500}
                          autoPlay
                          muted
                          playsInline
                          width={500}
                          className=" h-[100%] w-[100%] object-contain py-2"
                          src={fileRef.current}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <div className=" border p-2 rounded-md">
                        <RiImageAddLine className="h-5 w-5" />
                      </div>
                      <div className=" text-center">
                        <span className="text-sm text-zinc-200">
                          Drag an image/video
                        </span>
                        <p className=" text-zinc-400 text-xs">
                          Select a image/video or drag here to upload directly
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </label>
              <Input
                placeholder="Custom Redirect Link (optional)"
                type="text"
                disabled={uploading}
                ref={linkRef}
              />
              <Input
                value={instaLink}
                disabled={uploading}
                onChange={(e) => setInstaLink(e.target.value)}
                placeholder="Upload from instagram (paste instagram link)"
                type="text"
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
              accept="image/*,video/*"
              id="galleryImage"
            />

            <label
              draggable
              htmlFor="galleryImage"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleChange}
            >
              <div className="border opacity-95 cursor-pointer leading-tight w-full gap-1 flex-col h-48 border-dashed  rounded-sm flex items-center justify-center">
                {selectedFile && fileRef.current ? (
                  <>
                    {selectedFile.type.startsWith("image") ? (
                      <Image
                        height={500}
                        width={500}
                        alt="image"
                        className=" h-[100%] w-[100%] object-contain py-2"
                        src={fileRef.current}
                      />
                    ) : (
                      <video
                        height={500}
                        autoPlay
                        muted
                        playsInline
                        width={500}
                        className=" h-[100%] w-[100%] object-contain py-2"
                        src={fileRef.current}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className=" border p-2 rounded-md">
                      <RiImageAddLine className="h-5 w-5" />
                    </div>
                    <div className=" text-center">
                      <p className=" text-zinc-400 pt-1 text-xs">
                        Select a image/video to upload
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>
            <Input
              placeholder="Custom Redirect Link (optional)"
              type="text"
              disabled={uploading}
              ref={linkRef}
            />
            <Input
              value={instaLink}
              disabled={uploading}
              onChange={(e) => setInstaLink(e.target.value)}
              placeholder="Upload from instagram (paste instagram link)"
              type="text"
            />
          </motion.div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
});
ImageGallery.displayName = "ImageGallery";

export default ImageGallery;
