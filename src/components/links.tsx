"use client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/store/context";

import Link from "next/link";
import { IoMdRemove } from "react-icons/io";

import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { IUser } from "@/lib/models/userModel";
import { showError } from "@/lib/utils";
import { useRef } from "react";

export function Links({
  details,
  loggedIn,
}: {
  details: IUser;
  loggedIn: Boolean;
}) {
  const { links, setLinks, setLoader } = useUserContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleRemove = async (id: number) => {
    try {
      setLoader(true);
      const updatedLinks = links?.filter((link) => link?.id !== id || "");

      setLinks(updatedLinks || []);
      if (updatedLinks?.length === 0) {
        closeRef.current?.click();
        setLinks([]);
      }
      const response = await fetch("/api/update", {
        method: "PATCH",
        body: JSON.stringify({
          type: "remove-links",
          data: updatedLinks?.map((r) => r.url),
        }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoader(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className={`${links?.length === 0 && "hidden"} w-fit`}>
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              stiffness: 45,
            }}
            exit={{ y: 0, opacity: 0 }}
            className="flex -mt-[0.77rem] w-fit cursor-pointer font-normal leading-tight dark:text-zinc-300 items-center pl-[0.4rem] text-sm"
          >
            {!links ? (
              details?.links?.slice(0, 3).map((data, i) => (
                <Avatar
                  key={data?.image + i}
                  className={` ${
                    i === 0 ? "" : "-ml-2.5"
                  } h-7 w-7 border-2 border-zinc-100`}
                >
                  <AvatarImage
                    className=" w-[100%] h-[100%] object-cover"
                    src={data?.image || "/notFound.jpg"}
                  />
                  <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
                </Avatar>
              ))
            ) : (
              <>
                {links?.slice(0, 3).map((data, i) => (
                  <Avatar
                    key={data?.image + i}
                    className={` ${
                      i === 0 ? "" : "-ml-2.5"
                    } h-7 w-7 border-2 border-zinc-100`}
                  >
                    <AvatarImage
                      className=" w-[100%] h-[100%] object-cover"
                      src={data?.image || "/notFound.jpg"}
                    />
                    <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
                  </Avatar>
                ))}
              </>
            )}
            {!links && details.links.length > 3 ? (
              <Avatar className="-ml-2.5 h-7 w-7 border-2 border-zinc-100">
                <AvatarImage
                  className=" w-[100%] h-[100%] object-cover"
                  src=""
                />
                <AvatarFallback className="bg-zinc-800 text-xs">
                  +{details.links.length - 3}
                </AvatarFallback>
              </Avatar>
            ) : (
              <>
                {links && links.length > 3 && (
                  <Avatar className="-ml-2.5 h-7 w-7 border-2 border-zinc-100">
                    <AvatarImage
                      className=" w-[100%] h-[100%] object-cover"
                      src=""
                    />
                    <AvatarFallback className="bg-zinc-800 text-xs">
                      +{links.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </>
            )}
          </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-xl rounded-xl ">
          <DialogHeader>
            <DialogTitle>Links</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className=" flex flex-col gap-2 w-full items-center">
              {links?.map((data, i) => (
                <div
                  key={data?.url + i}
                  className=" w-full flex gap-2 items-center"
                >
                  {loggedIn && (
                    <IoMdRemove
                      onClick={() => handleRemove(data?.id)}
                      className=" hover:text-zinc-100 text-zinc-400 cursor-pointer"
                    />
                  )}
                  <motion.div
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      href={data?.url || ""}
                      target="_blank"
                      className=" w-full py-2 flex gap-2 items-center"
                    >
                      <Avatar className="h-10 w-10 border-2 border-zinc-100">
                        <AvatarImage
                          className=" w-[100%] h-[100%] object-cover"
                          src={data?.image || "/notFound.jpg"}
                        />
                        <AvatarFallback className="bg-zinc-800 text-xs">
                          !
                        </AvatarFallback>
                      </Avatar>
                      <div className=" leading-tight text-start">
                        <p className="text-zinc-100 hover:text-zinc-300 duration-500 transition-all truncate md:max-w-[20dvw]  max-w-[55dvw]">
                          {data?.title}
                        </p>
                        <p className=" text-xs truncate md:max-w-[17dvw] max-w-[50dvw] text-zinc-400">
                          {data?.url.replace(/^(https?:\/\/)?(www\.)?/, "")}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
            <DialogClose ref={closeRef} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger className={`${links?.length === 0 && "hidden"} w-fit`}>
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.7,
            stiffness: 45,
          }}
          exit={{ y: 0, opacity: 0 }}
          className="flex -mt-2.5 cursor-pointer  w-fit font-normal leading-tight dark:text-zinc-300 items-center pl-1.5 text-sm"
        >
          {!links ? (
            details.links.slice(0, 3).map((data, i) => (
              <Avatar
                key={data?.image + i}
                className={` ${
                  i === 0 ? "" : "-ml-2.5"
                } h-7 w-7 border-2 border-zinc-100`}
              >
                <AvatarImage
                  className=" w-[100%] h-[100%] object-cover"
                  src={data?.image || "/notFound.jpg"}
                />
                <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
              </Avatar>
            ))
          ) : (
            <>
              {links?.slice(0, 3).map((data, i) => (
                <Avatar
                  key={data?.image || "" + i}
                  className={` ${
                    i === 0 ? "" : "-ml-2.5"
                  } h-7 w-7 border-2 border-zinc-100`}
                >
                  <AvatarImage
                    className=" w-[100%] h-[100%] object-cover"
                    src={data?.image || "/notFound.jpg"}
                  />
                  <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
                </Avatar>
              ))}
            </>
          )}
          {!links && details.links.length > 3 ? (
            <Avatar className="-ml-2.5 h-7 w-7 border-2 border-zinc-100">
              <AvatarImage className=" w-[100%] h-[100%] object-cover" src="" />
              <AvatarFallback className="bg-zinc-800 text-xs">
                +{details.links.length - 3}
              </AvatarFallback>
            </Avatar>
          ) : (
            <>
              {links && links.length > 3 && (
                <Avatar className="-ml-2.5 h-7 w-7 border-2 border-zinc-100">
                  <AvatarImage
                    className=" w-[100%] h-[100%] object-cover"
                    src=""
                  />
                  <AvatarFallback className="bg-zinc-800 text-xs">
                    +{links.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </>
          )}
        </motion.div>
      </DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Links</DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <div className=" flex flex-col gap-2 w-full items-center">
            {links?.map((data, i) => (
              <div
                key={data?.url + i}
                className=" w-full flex gap-2 items-center"
              >
                {loggedIn && (
                  <IoMdRemove
                    onClick={() => handleRemove(data?.id)}
                    className=" hover:text-zinc-100 text-zinc-400 cursor-pointer"
                  />
                )}
                <motion.div
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={data?.url || ""}
                    target="_blank"
                    className=" w-full py-2 flex gap-2 items-center"
                  >
                    <Avatar className="h-10 w-10 border-2 border-zinc-100">
                      <AvatarImage
                        className=" w-[100%] h-[100%] object-cover"
                        src={data?.image || "/notFound.jpg"}
                      />
                      <AvatarFallback className="bg-zinc-800 text-xs">
                        !
                      </AvatarFallback>
                    </Avatar>
                    <div className=" leading-tight text-start">
                      <p className="text-zinc-100 truncate md:max-w-[20dvw]  max-w-[70dvw]">
                        {data?.title}
                      </p>
                      <p className=" text-xs truncate md:max-w-[17dvw] max-w-[65dvw] text-zinc-400">
                        {data?.url.replace(/^(https?:\/\/)?(www\.)?/, "")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>{" "}
          <DrawerClose ref={closeRef} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
