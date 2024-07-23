import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { chunk, formatNumber, isValidURL } from "@/lib/utils";
import { motion } from "framer-motion";
import { AiOutlineDelete } from "react-icons/ai";
import { useUserContext } from "@/store/context";
import { gallery } from "@/app/types/types";
import { toast } from "sonner";
import { PiCursorClick } from "react-icons/pi";
import {
  Dialog,
  DialogClose,
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
} from "@/components/ui/drawer";
import { Button } from "./button";
import { Input } from "./input";
import { Loader } from "lucide-react";
import { useMediaQuery } from "@react-hook/media-query";
import { MdArrowOutward } from "react-icons/md";
import mongoose from "mongoose";

interface MasonryType {
  column?: Breakpoint;
  data: gallery[];
  remove?: boolean;
}

type Breakpoint = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

const Masonry: React.FunctionComponent<MasonryType> = ({
  data,
  column = {
    xs: 2,
    sm: 2,
    md: 5,
    lg: 5,
    xl: 6,
    xxl: 6,
  },
  remove,
}) => {
  const [currentColumn, setCurrentColumn] = useState<number>(4);
  const [columnWidth, setColumnWidth] = useState<number>(0);

  const handleColumns = useCallback(() => {
    const windowWidth = window.innerWidth;
    let currentBreakpointColumns: number;
    let currentBreakpointColumnWidth: number;

    switch (true) {
      case windowWidth < 640:
        currentBreakpointColumns = column.xs;
        currentBreakpointColumnWidth = 50;
        break;
      case windowWidth < 768:
        currentBreakpointColumns = column.sm;
        currentBreakpointColumnWidth = 50;
        break;
      case windowWidth < 1024:
        currentBreakpointColumns = column.md;
        currentBreakpointColumnWidth = 40;
        break;
      case windowWidth < 1280:
        currentBreakpointColumns = column.lg;
        currentBreakpointColumnWidth = 30;
        break;
      case windowWidth < 1536:
        currentBreakpointColumns = column.xl;
        currentBreakpointColumnWidth = 25;
        break;
      case windowWidth > 1536:
        currentBreakpointColumns = column.xxl;
        currentBreakpointColumnWidth = 25;
        break;
      default:
        currentBreakpointColumns = column.md;
        currentBreakpointColumnWidth = 40;
        break;
    }

    setCurrentColumn(currentBreakpointColumns);
    setColumnWidth(currentBreakpointColumnWidth);
  }, [column]);

  useEffect(() => {
    handleColumns();

    window.addEventListener("resize", handleColumns);

    return () => window.removeEventListener("resize", handleColumns);
  }, [column, handleColumns]);

  const chunkSize = Math.ceil(data.length / currentColumn);

  const { gallery, setGallery } = useUserContext();
  const distributed = chunk(data, chunkSize);
  const { setLoader, user } = useUserContext();
  const handleDelete = async (id: mongoose.Types.ObjectId, del: string) => {
    if (gallery && user) {
      try {
        setLoader(true);
        const p = gallery.filter((g) => g._id !== id);
        setGallery(p);
        const result = await fetch("/api/delete", {
          method: "DELETE",
          body: JSON.stringify({ id: id }),
        });
        if (!result.ok) {
          throw new Error((await result.json()).message);
        }
        await fetch(del).catch((err) => console.error(err));
      } catch (error) {
        //@ts-expect-error:expected error
        toast.error(error.message);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleClick = async (imageObj: gallery) => {
    imageObj.link && imageObj.link.length > 0
      ? window.open(imageObj.link)
      : window.open(imageObj.data);
    if (remove) return;
    try {
      await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          id: imageObj._id,
          _id: user?._id,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className=" overflow-hidden flex justify-start gap-4 w-full">
      {distributed?.map((innerArray, rowIndex) => (
        <div key={rowIndex} style={{ width: `${columnWidth}%` }}>
          {innerArray?.map((imageObj, columnIndex) => (
            <motion.div
              initial={{
                y: "5dvh",
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: Number(
                  `${Math.floor(rowIndex / 10) + 1}.${rowIndex % 10}`
                ),
                type: "spring",
                stiffness: 45,
              }}
              exit={{ y: "5dvh", opacity: 0 }}
              key={columnIndex}
              className="  pb-4"
            >
              {imageObj.type === "image" ? (
                <Image
                  priority
                  height={500}
                  width={500}
                  onClick={() => handleClick(imageObj)}
                  src={imageObj.data}
                  onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
                  className={`${"cursor-pointer"} rounded-xl h-auto w-[100%] object-cover relative`}
                  alt={`Image ${rowIndex}-${columnIndex}`}
                />
              ) : (
                <video
                  autoPlay
                  playsInline
                  muted
                  height={500}
                  loop
                  preload="auto"
                  poster="https://i.pinimg.com/564x/ad/cc/78/adcc78565b5a28df785d8c904574c21d.jpg"
                  width={500}
                  onClick={(e) => e.currentTarget.play()}
                  src={imageObj.data}
                  onMouseEnter={(e) => (e.currentTarget.muted = false)}
                  onMouseLeave={(e) => (e.currentTarget.muted = true)}
                  onPlay={(e) => (e.currentTarget.poster = "")}
                  onCanPlayThrough={(e) => {
                    e.currentTarget.controls = !remove;
                    e.currentTarget.poster = "";
                    e.currentTarget.play();
                  }}
                  className="cursor-pointer rounded-xl h-auto w-full object-cover relative"
                />
              )}

              {!remove && imageObj.type === "video" && (
                <div
                  onClick={() => handleClick(imageObj)}
                  className=" absolute flex gap-1 items-center text-base hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 right-2"
                >
                  <MdArrowOutward />
                </div>
              )}
              {remove && (
                <>
                  <div
                    onClick={(e) => (
                      e.stopPropagation(),
                      handleDelete(imageObj._id, imageObj.del)
                    )}
                    className=" absolute flex gap-2 items-center text-xl hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer bottom-6 right-2"
                  >
                    <AiOutlineDelete />
                  </div>
                </>
              )}
              {remove && <UpdateMasonry image={imageObj} />}
              {remove && (
                <div className=" absolute flex gap-1 items-center text-base hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 left-2">
                  <PiCursorClick /> {formatNumber(imageObj.clicks)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </main>
  );
};

const UpdateMasonry = ({ image }: { image: gallery }) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [link, setLink] = useState<string>(image.link || image.data);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleUpdate = async () => {
    const newLink = inputRef.current;
    if (newLink && isValidURL(newLink.value)) {
      setLoader(true);
      try {
        // await database.updateDocument(
        //   process.env.DATABASE_ID || "",
        //   process.env.GALLERY_ID || "",
        //   image.$id,
        //   {
        //     link: newLink.value,
        //   }
        // );

        setLink(newLink.value);
        closeRef.current?.click();
      } catch (error) {
        console.error(error);
        toast.error("something went wrong");
      } finally {
        setLoader(false);
      }
    } else {
      toast.error("invalid link");
    }
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className=" absolute flex gap-1 items-center text-lg hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 right-2">
          Edit
        </DialogTrigger>
        <DialogContent className="max-w-lg ">
          <DialogHeader>
            <DialogTitle>Edit Redirect Link</DialogTitle>
            <DialogDescription></DialogDescription>

            <div className="flex flex-col w-full gap-2.5">
              <Input ref={inputRef} placeholder={link} defaultValue={link} />

              <Button size={"sm"} onClick={handleUpdate} disabled={loader}>
                {loader ? (
                  <Loader className=" animate-spin h-5 w-5" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
            <DialogClose ref={closeRef} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger className=" absolute flex gap-1 items-center text-lg hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 right-2">
        Edit
      </DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Edit Redirect Link</DrawerTitle>
          <DrawerDescription></DrawerDescription>

          <div className="flex flex-col w-full gap-2.5">
            <Input ref={inputRef} placeholder={link} defaultValue={link} />
            <Button size={"sm"} onClick={handleUpdate} disabled={loader}>
              {loader ? <Loader className=" animate-spin h-5 w-5" /> : "Update"}
            </Button>
          </div>
          <DrawerClose ref={closeRef} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default Masonry;
