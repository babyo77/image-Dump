"use client";
import { AiOutlineLink } from "react-icons/ai";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { Settings } from "@/app/login/settings";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { client, database } from "@/lib/client/appwrite";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useUserContext } from "@/store/context";
import { getMetadata, isValidURL } from "@/lib/utils";
import { user } from "@/app/types/types";
import { AnimatePresence, motion } from "framer-motion";
import AddGalleryItems from "../addGalleryitems";
import Link from "next/link";
function Footer({ loggedIn, user }: { loggedIn: boolean; user: user }) {
  const handleShare = () => {
    try {
      navigator.share({
        url: window.location.origin + "/p/" + user.name,
      });
    } catch (error) {
      //@ts-expect-error:expected-error
      toast.error(error.message);
    }
  };

  const {
    setUser,
    user: loggedInUser,
    setLinks,
    links,
    setGallery,
  } = useUserContext();
  useEffect(() => {
    setUser(user);
    setLinks(user.links);
    setGallery(user.usersDoc.gallery);
    if (loggedIn && user.cookie) {
      client.setSession(user.cookie.value);
    }
    if (user.loggedInUser && user.loggedInUser.cookie) {
      client.setSession(user.loggedInUser.cookie.value);
    }
  }, [loggedIn, user, setUser, setLinks, setGallery]);

  const [loading, setLoading] = useState<boolean>(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleChange = useCallback(async () => {
    if (linkRef.current) {
      const link = linkRef.current.value;
      if (link.trim().length > 0 && isValidURL(link) && links) {
        if (links.length === 7)
          return toast.error("Maximum 7 links are allowed");
        try {
          setLoading(true);
          const newLink = await getMetadata(link);
          if (newLink) {
            const updated = await database.updateDocument(
              process.env.DATABASE_ID || "",
              process.env.USERS_ID || "",
              user.$id,
              {
                links: [link, ...links.map((l) => l.url)],
              }
            );
            if (updated) {
              setLinks([{ ...newLink, id: links.length + 1 }, ...links]);
              linkRef.current.value = "";
              if (closeRef.current) {
                closeRef.current.click();
              }
            }
          } else {
            toast.error("something went wrong");
          }
          setLoading(false);
        } catch (error) {
          //@ts-expect-error:expected
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("invalid link");
      }
    }
  }, [links, setLinks, user.$id]);

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isScrolling && loggedIn && (
        <div className="w-full flex overflow-hidden justify-center items-center">
          <motion.div
            initial={{ y: "100dvh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 45,
              delay: 0.25,
            }}
            exit={{ y: "100dvh", opacity: 0 }}
            className="fixed p-2.5 px-4 flex gap-4 backdrop-blur-md dark:bg-primary-foreground/95 border items-center rounded-xl bottom-6"
          >
            {loggedIn ? (
              <Button
                onClick={handleShare}
                size={"sm"}
                variant={"default"}
                className="font-medium"
              >
                Share my profile
              </Button>
            ) : (
              <Link href={"/login"}>
                <Button size={"sm"} variant={"default"} className="font-medium">
                  Get your Own
                </Button>
              </Link>
            )}
            <div className="px-[0.02rem] bg-zinc-500 py-3"></div>
            {loggedIn ? (
              <>
                <Settings />
                <Popover>
                  <PopoverTrigger
                    ref={closeRef}
                    className="cursor-pointer ml-1 hover:text-zinc-300 transition-all duration-300"
                  >
                    <AiOutlineLink className="h-[1.17rem] w-[1.17rem]" />
                  </PopoverTrigger>
                  <PopoverContent className="mb-[1.35rem] mr-4 p-0 ">
                    <div className="flex items-center">
                      <Input
                        style={{
                          WebkitMaskImage:
                            "linear-gradient(to right, black 90%, transparent 100%)",
                          maskImage:
                            "linear-gradient(to right, black 90%, transparent 100%)",
                        }}
                        type="url"
                        ref={linkRef}
                        disabled={loading}
                        placeholder={loggedInUser?.links[0].url || ""}
                        className=" bg-primary-foreground/80 rounded-md border-none"
                      />
                      <Button
                        onClick={handleChange}
                        disabled={loading}
                        size={"sm"}
                        className="m-0 pl-0 rounded-sm text-zinc-300 hover:text-zinc-100  bg-inherit hover:bg-inherit "
                      >
                        {!loading ? (
                          "Link"
                        ) : (
                          <Loader className=" animate-spin h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className=" flex items-center justify-center cursor-pointer hover:text-zinc-300 transition-all duration-300">
                  <AddGalleryItems />
                </div>
              </>
            ) : (
              <Button size={"sm"} variant={"default"} className="font-medium">
                Are u a match?
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Footer;
