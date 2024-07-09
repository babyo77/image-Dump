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
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { BiSolidUserVoice } from "react-icons/bi";
import { Map, MapPinned, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
function Profile({
  loggedIn,
  discover,
}: {
  loggedIn?: user | null;
  discover: discover[];
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<discover[]>(discover);
  const [space, setSpace] = useState<boolean>(false);
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
        setProfiles(
          loggedIn ? data.filter((u) => u.$id !== loggedIn.$id) : data
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
              <Link href={"/p"}>
                <div className=" h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    alt="profile-image"
                    src={loggedIn ? loggedIn.prefs["image"] : "/notFound.jpg"}
                    height={200}
                    width={200}
                    className=" h-[100%] w-[100%] object-cover"
                  />
                </div>
              </Link>
              <Button size={"sm"} onClick={() => setSpace(false)}>
                Dumps
              </Button>
            </motion.div>
          </header>
          <div className=" w-full md:px-14 gap-2 px-4 py-2 flex items-center justify-between">
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
              <Button
                size={"sm"}
                variant={"secondary"}
                className=" flex gap-1 py-5 items-center"
              >
                <BiSolidUserVoice className="h-5 w-5" />
                Create your space
              </Button>
            </motion.div>
          </div>
          <div className=" flex md:flex-wrap max-md:flex-col w-full md:px-14 gap-5 px-4 py-4">
            {Array.from(Array(7)).map((_, i) => (
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
                key={i}
                className=" rounded-xl min-h-52 md:min-w-[22.1dvw] bg-neutral-900 p-5 border relative"
              >
                <p className="break-words font-medium md:max-w-[19.2dvw]">
                  Which anime to watch today?sdasd as das d asd
                </p>
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7,
                    stiffness: 45,
                  }}
                  exit={{ y: 0, opacity: 0 }}
                  className="flex  cursor-pointer w-fit font-normal leading-tight dark:text-zinc-300 items-center text-sm pt-5 pb-1.5"
                >
                  {Array.from(Array(4)).map((_, i) => (
                    <Avatar
                      key={i}
                      className={` ${
                        i === 0 ? "" : "-ml-2.5"
                      } h-8 w-8 border-2 border-zinc-100`}
                    >
                      <AvatarImage
                        className=" w-[100%] h-[100%] object-cover"
                        src={"/notFound.jpg"}
                      />
                      <AvatarFallback className=" bg-zinc-800">
                        !
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </motion.div>
                <div className=" text-sm text-neutral-300">
                  <p>tanmay,tony,aman</p>
                </div>
                <div className=" absolute bottom-2 right-2 flex items-center text-base text-neutral-300">
                  2 <User className="h-4" />
                </div>
                <div className=" absolute bottom-2 left-2 flex items-center text-base text-neutral-400">
                  <MapPinned className="h-4" /> India
                </div>
              </motion.div>
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
                      delay: Number(`1.${i}`),
                      type: "spring",
                      stiffness: 45,
                    }}
                    exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
                    key={user.$id + i}
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
