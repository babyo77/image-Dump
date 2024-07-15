"use client";
import React, { useCallback, useEffect, useState } from "react";
import { discover } from "../types/types";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { PiStack } from "react-icons/pi";
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
import { Input } from "@/components/ui/input";

import UserSettings from "./navigation";
import CreateSpace from "./createSpace";
import { useUserContext } from "@/store/context";
import { RoomCard } from "./room/roomCard";
import { IUser } from "@/lib/models/userModel";
function Profile({
  loggedIn,
  discover,
}: {
  loggedIn?: IUser | null;
  discover: discover[];
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<discover[]>(discover);
  const [space, setSpace] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMode, setCurrentMode] = useState<"pop" | "for" | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { setUser } = useUserContext();
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
        setProfiles(
          loggedIn ? data.filter((u) => u._id !== loggedIn._id) : data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsExiting(false);
        setLoader(false);
      }
    }
  }, [currentMode, loggedIn]);

  return (
    <>
      {space ? (
        <AnimatePresence>
          <header className=" w-full flex leading-tight tracking-tighter justify-between py-4 md:px-14 px-4 items-center">
            <Link href={"/"}>
              <motion.p
                key={"spaces"}
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
                SPACE
              </motion.p>
            </Link>

            <motion.div
              key={"spaceOptions"}
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
              <UserSettings loggedIn={loggedIn} />
              <Button size={"sm"} onClick={() => setSpace(false)}>
                Dumps
              </Button>
            </motion.div>
          </header>
          <div className=" w-full md:px-14 gap-2 px-4 py-2 flex items-center justify-between">
            <motion.div
              key={"searchSpace"}
              initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                stiffness: 45,
              }}
              exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
            >
              <Input
                type="search"
                placeholder="Search space"
                className=" remove"
              />
            </motion.div>
            <motion.div
              key={"createSpace"}
              initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                stiffness: 45,
              }}
              exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
            >
              <CreateSpace />
            </motion.div>
          </div>
          <div className=" flex md:flex-wrap max-md:flex-col w-full md:px-14 gap-5 px-4 py-4">
            {Array.from(Array(12)).map((_, i) => (
              <RoomCard
                key={i + 1}
                index={i}
                name="demo"
                ownerId="1232"
                speakers={["asasds"]}
                total={7}
                listeners={["sdas"]}
                location="india"
                id="asd"
              />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <header className=" w-full flex leading-tight tracking-tighter justify-between py-4 md:px-14 px-4 items-center">
            <Link href={"/"}>
              <motion.p
                key={"dumps"}
                initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7,
                  stiffness: 45,
                }}
                exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                className=" font-semibold text-3xl gap-0.5 flex items-center"
              >
                <PiStack />
                DUMP
              </motion.p>
            </Link>
            <motion.div
              key={"dumpOptions"}
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
                <SelectTrigger className="w-[130px] md:w-[180px]">
                  <SelectValue placeholder="Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Popular</SelectItem>
                  <SelectItem value="for">For you</SelectItem>
                </SelectContent>
              </Select>

              <Button size={"sm"} onClick={() => setSpace(true)}>
                Spaces
              </Button>
            </motion.div>
          </header>
          <AnimatePresence>
            {loader && (
              <motion.div
                key={"finding"}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                exit={{ filter: "blur(10px)", opacity: 0 }}
                transition={{ duration: 0.4 }}
                className=" w-full flex items-center justify-center h-[80dvh]"
              >
                <p className="font-semibold text-xl flex items-center">
                  Finding...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex max-md:flex-col md:flex-wrap w-full items-center no-scrollbar h-[90dvh] overflow-y-scroll md:justify-center max-md:snap-y max-md:snap-mandatory scroll-smooth text-center px-4 text-neutral-200 pb-5 gap-6 ">
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
                      delay: Number(`${Math.floor(i / 10) + 1}.${i % 10}`),
                      type: "spring",
                      stiffness: 45,
                    }}
                    exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
                    key={user._id + i}
                    className="relative rounded-xl max-md:snap-start scroll-smooth overflow-hidden md:w-[22dvw] md:min-h-[70dvh] min-h-[80dvh] border w-full"
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
        </AnimatePresence>
      )}
    </>
  );
}

export default Profile;
