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
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useUserContext } from "@/store/context";
import { AnimatePresence, motion } from "framer-motion";
import AddGalleryItems from "../addGalleryitems";
import Link from "next/link";
import { IUser } from "@/lib/models/userModel";
import { showError } from "@/lib/utils";
function Footer({ loggedIn, user }: { loggedIn: boolean; user: IUser }) {
  const { user: loggedInUser } = useUserContext();
  const handleShare = async () => {
    const url = window.location.origin + "/p/" + loggedInUser?.username;
    try {
      if (navigator.share) {
        navigator.share({
          url,
        });
      } else {
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link copied to clipboard");
        });
      }
    } catch (error) {
      //@ts-expect-error:expected-error
      toast.error(error.message);
    }
  };

  const { setUser, setLinks, setGallery, links, loader } = useUserContext();
  useEffect(() => {
    setUser(user);
    setGallery(user.gallery || []);
    setLinks(user.links || []);
  }, [user, setUser, setLinks, setGallery]);

  const [loading, setLoading] = useState<boolean>(false);
  const linkRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleChange = useCallback(async () => {
    const link = linkRef.current?.value;
    try {
      setLoading(true);
      const metadata = await fetch(`/api/metadata?url=${link}`);
      if (metadata.ok) {
        setLinks([
          { ...(await metadata.json()), url: link, id: links?.length },
          ...(links || []),
        ]);
      }
      const response = await fetch("/api/update", {
        method: "PATCH",
        body: JSON.stringify({ type: "links", data: link }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message);
      }
      closeRef.current?.click();
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [setLinks, links]);

  return (
    <AnimatePresence>
      {loggedIn && (
        <div className="w-full flex overflow-hidden justify-center items-center">
          <motion.div
            initial={{ y: "100dvh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 45,
              delay: 1.2,
            }}
            exit={{ y: "100dvh", opacity: 0 }}
            className="fixed p-2.5 px-2.5 flex gap-4 backdrop-blur-md dark:bg-primary-foreground/95 border items-center rounded-xl bottom-6"
          >
            {loggedIn ? (
              <Button
                onClick={handleShare}
                size={"sm"}
                disabled={loader}
                variant={"default"}
                className="font-medium w-[8.5rem]"
              >
                {loader ? (
                  <div className="flex gap-0.5 items-center">
                    <Loader className=" animate-spin h-4 w-4" />
                    <p>Saving...</p>
                  </div>
                ) : (
                  "Share my profile"
                )}
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
                        type="url"
                        ref={linkRef}
                        disabled={loading}
                        placeholder="Add new link in bio"
                        className=" bg-primary-foreground/80 rounded-none border-none"
                      />
                      <Button
                        onClick={handleChange}
                        disabled={loading}
                        className="m-0 pl-0 rounded-none text-zinc-300 hover:text-zinc-100  bg-primary-foreground/80 shadow-none hover:bg-primary-foreground/80"
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
