"use client";
import React, { useCallback, useState } from "react";
import { discover, user } from "../types/types";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { PiStack } from "react-icons/pi";
import { popup } from "@/components/ui/popup";
import { useMediaQuery } from "@react-hook/media-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDiscover } from "@/action/getDiscover";
import { useRouter } from "next/navigation";

function Profile({
  loggedIn,
  discover,
}: {
  loggedIn?: user | null;
  discover: discover[];
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<discover[]>(discover);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMode, setCurrentMode] = useState<"pop" | "for" | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleMode = useCallback(
    (mode: string) => {
      if (mode === "for" && !loggedIn) {
        router.push("/login");
        return;
      }
      setIsExiting(true);
      setCurrentMode(mode as "pop" | "for");
    },
    [router, loggedIn]
  );

  const fetchProfiles = useCallback(async () => {
    if (currentMode) {
      try {
        setLoader(true);
        const data = await getDiscover(currentMode);
        setProfiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsExiting(false);
        setLoader(false);
      }
    }
  }, [currentMode]);

  return (
    <>
      <header className=" w-full flex leading-tight tracking-tighter justify-between py-5 md:px-14 px-5">
        <Link href={"/"}>
          <motion.p
            initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              stiffness: 45,
            }}
            exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
            className=" font-semibold text-3xl pl-1.5 gap-0.5 flex items-center"
          >
            <PiStack />
            DUMP
          </motion.p>
        </Link>
        <motion.div
          initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.7,
            stiffness: 45,
          }}
          exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
          className="flex items-center gap-2"
        >
          <Select onValueChange={(e) => handleMode(e)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pop">Popular</SelectItem>
              <SelectItem value="for">For you</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size={"sm"}
            onClick={() => (
              popup.show(),
              popup.updateMessage("A place to chill with friends and stranger.")
            )}
          >
            Spaces
          </Button>
        </motion.div>
      </header>
      {loader && (
        <div className=" w-full flex items-center justify-center h-[80dvh]">
          <p className="font-semibold text-xl flex items-center">Finding...</p>
        </div>
      )}
      <div className="flex max-md:flex-col md:flex-wrap w-full items-center no-scrollbar h-[90dvh] overflow-y-scroll md:justify-center max-md:snap-y max-md:snap-mandatory scroll-smooth text-center px-5 text-neutral-200 pb-5 gap-4 gap-y-5">
        <AnimatePresence onExitComplete={fetchProfiles}>
          {!isExiting &&
            profiles.map((user, i) => (
              <motion.div
                initial={{
                  y: isDesktop ? "5dvh" : 0,
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.5,
                  delay: Number(`1.${i}`),
                  type: "spring",
                  stiffness: 45,
                }}
                exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
                key={user.$id}
                className={`${i === profiles.length - 1 && ""} ${
                  i === 0 && ""
                } relative rounded-xl max-md:snap-start scroll-smooth overflow-hidden md:w-[22dvw] md:min-h-[70dvh] min-h-[80dvh] border w-full`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${user.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.6,
                  }}
                ></div>
                <div className=" absolute top-3 right-2">
                  <Link href={`/p/${user.username}`} target="_blank">
                    <MdOutlineArrowOutward className=" h-7 w-7" />
                  </Link>
                </div>
                <div className=" absolute top-3 left-2">
                  <Link href={`/p`} target="_blank">
                    <Button size={"sm"}>
                      {loggedIn ? "View your profile" : "Get your own"}
                    </Button>
                  </Link>
                </div>
                <div className=" absolute bottom-0 tracking-tight w-full text-start py-4 px-3">
                  <p className=" text-4xl font-semibold break-words">
                    {user.fullName}
                  </p>
                  <Link href={`/p/${user.username}`} target="_blank">
                    <p className="text-sm text-neutral-300 underline underline-offset-2 ">
                      @{user.username}
                    </p>
                  </Link>

                  <p className=" text-base mt-0.5 text-neutral-200  font-medium break-words">
                    {user.bio}
                  </p>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Profile;
