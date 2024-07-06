"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/store/context";
import { user } from "@/app/types/types";
import Link from "next/link";
import { IoMdRemove } from "react-icons/io";
import { useCallback } from "react";
import { database } from "@/lib/client/appwrite";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export function Links({
  details,
  loggedIn,
}: {
  details: user;
  loggedIn: Boolean;
}) {
  const { links, setLinks, setLoader } = useUserContext();
  const handleRemove = useCallback(
    async (remove: number) => {
      if (links && loggedIn) {
        const previousLinks = [...links];
        try {
          setLoader(true);
          const filter = links.filter((link) => link.id !== remove);
          setLinks(filter);
          await database.updateDocument(
            process.env.DATABASE_ID || "",
            process.env.USERS_ID || "",
            details.$id,
            {
              links: filter.map((r) => r.url),
            }
          );
        } catch (error) {
          setLinks(previousLinks);
          //@ts-expect-error:expected
          toast.error(error.message);
        } finally {
          setLoader(false);
        }
      }
    },

    [setLinks, links, details, loggedIn, setLoader]
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className="w-fit">
          <motion.div
            initial={{ y: "5dvh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 45,
            }}
            exit={{ y: "5dvh", opacity: 0 }}
            className="flex -mt-2.5 cursor-pointer  font-normal leading-tight dark:text-zinc-300 items-center pl-1.5 text-sm"
          >
            {!links ? (
              details.links.slice(0, 3).map(({ image }, i) => (
                <Avatar
                  key={image + i}
                  className={` ${
                    i === 0 ? "" : "-ml-2.5"
                  } h-7 w-7 border-2 border-zinc-100`}
                >
                  <AvatarImage
                    className=" w-[100%] h-[100%] object-cover"
                    src={image || "/notFound.jpg"}
                  />
                  <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
                </Avatar>
              ))
            ) : (
              <>
                {links.slice(0, 3).map(({ image }, i) => (
                  <Avatar
                    key={image + i}
                    className={` ${
                      i === 0 ? "" : "-ml-2.5"
                    } h-7 w-7 border-2 border-zinc-100`}
                  >
                    <AvatarImage
                      className=" w-[100%] h-[100%] object-cover"
                      src={image || "/notFound.jpg"}
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
        <DialogContent className="w-[40dvw] rounded-xl bg-zinc-950/90">
          <DialogHeader>
            <DialogTitle>Links</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className=" flex flex-col gap-2 w-full items-center">
              {links?.map(({ url, title, image, id }, i) => (
                <div key={url + i} className=" w-full flex gap-2 items-center">
                  {loggedIn && (
                    <IoMdRemove
                      onClick={() => handleRemove(id)}
                      className=" hover:text-zinc-100 text-zinc-400 cursor-pointer"
                    />
                  )}
                  <motion.div
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      href={url}
                      target="_blank"
                      className=" w-full py-2 flex gap-2 items-center"
                    >
                      <Avatar className="h-10 w-10 border-2 border-zinc-100">
                        <AvatarImage
                          className=" w-[100%] h-[100%] object-cover"
                          src={image || "/notFound.jpg"}
                        />
                        <AvatarFallback className="bg-zinc-800 text-xs">
                          !
                        </AvatarFallback>
                      </Avatar>
                      <div className=" leading-tight text-start">
                        <p className="text-zinc-100 hover:text-zinc-300 duration-500 transition-all truncate md:max-w-[20dvw]  max-w-[55dvw]">
                          {title}
                        </p>
                        <p className=" text-xs truncate md:max-w-[17dvw] max-w-[50dvw] text-zinc-400">
                          {url.replace(/^(https?:\/\/)?(www\.)?/, "")}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger>
        <motion.div
          initial={{ y: "5dvh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 45,
          }}
          exit={{ y: "5dvh", opacity: 0 }}
          className="flex -mt-2.5 cursor-pointer max-w-[90dvw] font-normal leading-tight dark:text-zinc-300 items-center pl-1.5 text-sm"
        >
          {!links ? (
            details.links.slice(0, 3).map(({ image }, i) => (
              <Avatar
                key={image + i}
                className={` ${
                  i === 0 ? "" : "-ml-2.5"
                } h-7 w-7 border-2 border-zinc-100`}
              >
                <AvatarImage
                  className=" w-[100%] h-[100%] object-cover"
                  src={image || "/notFound.jpg"}
                />
                <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
              </Avatar>
            ))
          ) : (
            <>
              {links.slice(0, 3).map(({ image }, i) => (
                <Avatar
                  key={image + i}
                  className={` ${
                    i === 0 ? "" : "-ml-2.5"
                  } h-7 w-7 border-2 border-zinc-100`}
                >
                  <AvatarImage
                    className=" w-[100%] h-[100%] object-cover"
                    src={image || "/notFound.jpg"}
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
            {links?.map(({ url, title, image, id }, i) => (
              <div key={url + i} className=" w-full flex gap-2 items-center">
                {loggedIn && (
                  <IoMdRemove
                    onClick={() => handleRemove(id)}
                    className=" hover:text-zinc-100 text-zinc-400 cursor-pointer"
                  />
                )}
                <motion.div
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={url}
                    target="_blank"
                    className=" w-full py-2 flex gap-2 items-center"
                  >
                    <Avatar className="h-10 w-10 border-2 border-zinc-100">
                      <AvatarImage
                        className=" w-[100%] h-[100%] object-cover"
                        src={image || "/notFound.jpg"}
                      />
                      <AvatarFallback className="bg-zinc-800 text-xs">
                        !
                      </AvatarFallback>
                    </Avatar>
                    <div className=" leading-tight text-start">
                      <p className="text-zinc-100 truncate md:max-w-[20dvw]  max-w-[70dvw]">
                        {title}
                      </p>
                      <p className=" text-xs truncate md:max-w-[17dvw] max-w-[65dvw] text-zinc-400">
                        {url.replace(/^(https?:\/\/)?(www\.)?/, "")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
