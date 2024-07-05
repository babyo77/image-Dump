import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { chunk, formatNumber, isValidURL } from "@/lib/utils";
import { motion } from "framer-motion";
import { AiOutlineDelete } from "react-icons/ai";
import { database } from "@/lib/client/appwrite";
import { useUserContext } from "@/store/context";
import { gallery } from "@/app/types/types";
import { MdOutlineArrowOutward } from "react-icons/md";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Query } from "appwrite";

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
    md: 6,
    lg: 4,
    xl: 6,
    xxl: 6,
  },
  remove,
}) => {
  const [currentColumn, setCurrentColumn] = useState<number>(4);
  const [columnWidth, setColumnWidth] = useState<number>(0);

  const handleColumns = () => {
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
  };

  useEffect(() => {
    handleColumns();

    window.addEventListener("resize", handleColumns);

    return () => window.removeEventListener("resize", handleColumns);
  }, [column]);

  const chunkSize = Math.ceil(data.length / currentColumn);

  const { gallery, setGallery } = useUserContext();
  const distributed = chunk(data, chunkSize);
  const { setLoader, user } = useUserContext();
  const handleDelete = async (id: string, del: string) => {
    if (gallery && user) {
      try {
        setLoader(true);
        const p = gallery.filter((g) => g.$id !== id);
        setGallery(p);
        await fetch(del).catch();
        const update = await database.getDocument(
          process.env.DATABASE_ID || "",
          process.env.USERS_ID || "",
          user.$id
        );
        await database.deleteDocument(
          process.env.DATABASE_ID || "",
          process.env.GALLERY_ID || "",
          id
        );
        await database.updateDocument(
          process.env.DATABASE_ID || "",
          process.env.USERS_ID || "",
          user.$id,
          {
            galleryTotal: update.galleryTotal - 1,
          }
        );
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
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ imageObj: imageObj, type: "click" }),
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
              initial={{ y: "5dvh", opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 45,
              }}
              exit={{ y: "5dvh", opacity: 0 }}
              key={columnIndex}
              className="  pb-4"
            >
              <Image
                priority
                height={500}
                width={500}
                onClick={() => handleClick(imageObj)}
                src={imageObj.data}
                onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
                className={`${"cursor-pointer"} rounded-lg h-auto w-[100%] object-cover relative`}
                alt={`Image ${rowIndex}-${columnIndex}`}
              />
              {remove && (
                <>
                  <div
                    onClick={(e) => (
                      e.stopPropagation(),
                      handleDelete(imageObj.$id, imageObj.del)
                    )}
                    className=" absolute flex gap-2 items-center text-xl hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer bottom-6 right-2"
                  >
                    <AiOutlineDelete />
                  </div>
                  <UpdateMasonry image={imageObj} />
                </>
              )}
              <p
                onClick={() => handleClick(imageObj)}
                className=" absolute flex gap-1 items-center text-lg hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 right-2"
              >
                <MdOutlineArrowOutward />
              </p>
              {remove && <ClicksAnalytics image={imageObj} />}
            </motion.div>
          ))}
        </div>
      ))}
    </main>
  );
};

export interface ClicksData {
  date: string;
  clicks: number;
}
const ClicksAnalytics = ({ image }: { image: gallery }) => {
  const [data, setData] = useState<ClicksData[]>([
    {
      date: new Date().toISOString().split("T")[0],
      clicks: 0,
    },
  ]);
  const analytics = useCallback(() => {
    const offset = 7 * 24 * 60 * 60 * 1000;
    const date = new Date();
    date.setTime(date.getTime() - offset);
    database
      .listDocuments(
        process.env.DATABASE_ID || "",
        process.env.ANALYTICS_ID || "",
        [
          Query.equal("for", image.$id),
          Query.equal("type", "image"),
          Query.select(["$createdAt"]),
          Query.greaterThanEqual("$createdAt", date.toISOString()),
          Query.limit(999),
        ]
      )
      .then((response) => {
        const aggregatedData: ClicksData[] = [];
        response.documents.forEach((doc) => {
          const createdAtDate = new Date(doc.$createdAt)
            .toISOString()
            .split("T")[0];
          const existingData = aggregatedData.find(
            (item) => item.date === createdAtDate
          );

          if (existingData) {
            existingData.clicks += 1;
          } else {
            aggregatedData.push({
              date: createdAtDate,
              clicks: 0,
            });
          }
        });
        if (response.total > 0) {
          setData(aggregatedData);
        }
      });
  }, [image]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderAnalytics = () => {
    return (
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ width: "100%", height: "100%", marginBottom: ".7rem" }}
      >
        <ResponsiveContainer>
          <AreaChart
            data={data}
            className=" text-xs md:text-base"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip />
            <Area
              type="monotoneX"
              dataKey="clicks"
              stroke="#000"
              fill="#ffffff"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    );
  };
  if (isDesktop) {
    return (
      <Dialog onOpenChange={analytics}>
        <DialogTrigger className=" absolute flex gap-1 items-center text-base hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 left-2">
          <PiCursorClick /> {formatNumber(image.clicks)}
        </DialogTrigger>
        <DialogContent className="w-[100dvw] rounded-xl border-none bg-zinc-950/90">
          <DialogHeader>
            <DialogTitle>Image Analytics</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className=" h-[87dvh] ">{renderAnalytics()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={analytics}>
      <DrawerTrigger className=" absolute flex gap-1 items-center text-base hover:text-neutral-200 text-zinc-200 transition-all duration-500 cursor-pointer top-2 left-2">
        <PiCursorClick /> {formatNumber(image.clicks)}
      </DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Image Analytics</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div style={{ width: "100%", height: 200 }}>{renderAnalytics()}</div>
      </DrawerContent>
    </Drawer>
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
        await database.updateDocument(
          process.env.DATABASE_ID || "",
          process.env.GALLERY_ID || "",
          image.$id,
          {
            link: newLink.value,
          }
        );
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
        <DialogTrigger className=" absolute flex gap-2 items-center text-base hover:text-zinc-500 text-zinc-200 transition-all duration-200 cursor-pointer bottom-6 left-2">
          Edit
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Redirect Link</DialogTitle>
            <DialogDescription></DialogDescription>

            <div className="flex flex-col w-full gap-2.5">
              <Input ref={inputRef} placeholder={link} value={link} />
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
      <DrawerTrigger className=" absolute flex gap-2 items-center text-base hover:text-zinc-500 text-zinc-200 transition-all duration-200 cursor-pointer bottom-6 left-2">
        Edit
      </DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Edit Redirect Link</DrawerTitle>
          <DrawerDescription></DrawerDescription>

          <div className="flex flex-col w-full gap-2.5">
            <Input
              ref={inputRef}
              placeholder={image.link || image.data}
              defaultValue={image.link || image.data}
            />
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
