"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import NumberTicker from "./ui/scrambleText";
import { Button } from "./ui/button";
import Link from "next/link";
import { Info, X } from "lucide-react";
import { useUserContext } from "@/store/context";
import RetroGrid from "./ui/grid";
import { user } from "@/app/types/types";
import { replaceInstagramURL } from "@/lib/utils";

interface UserProp {
  user: user | null;
}
const Particles: React.FC<UserProp> = ({ user }) => {
  const { match, setMatch } = useUserContext();
  return (
    <AnimatePresence>
      {match && user && (
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1 }}
          exit={{ filter: "blur(10px)", opacity: 0 }}
          onAnimationEnd={() => (document.body.style.overflow = "")}
          onAnimationComplete={() => (document.body.style.overflow = "")}
          className=" flex justify-center h-dvh items-center overflow-hidden"
        >
          <RetroGrid />
          <div className="absolute flex w-full gap-5 items-center justify-center flex-col">
            <div className=" flex justify-center items-center">
              <motion.div
                initial={{ x: "-100dvw", filter: "blur(10px)", opacity: 0 }}
                animate={{ x: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{ type: "spring", stiffness: 45, delay: 1.5 }}
              >
                <Avatar className="h-28 w-28 border-4 border-zinc-200">
                  <AvatarImage
                    src={
                      replaceInstagramURL(user?.match?.image || "") ||
                      "/notFound.jpg"
                    }
                    className=" h-[100%] w-[100%] object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ x: "100dvw", filter: "blur(10px)", opacity: 0 }}
                animate={{ x: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{ type: "spring", stiffness: 45, delay: 1.5 }}
              >
                <Avatar className="h-28 w-28 -ml-7 border-4 border-zinc-200">
                  <AvatarImage
                    src={
                      replaceInstagramURL(user?.prefs["image"]) ||
                      "/notFound.jpg"
                    }
                    className=" h-[100%] w-[100%] object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
            >
              <NumberTicker value={Number(user?.match?.per) || 0} delay={3} />{" "}
            </motion.div>
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 1,
                delay: 11,
                type: "spring",
                stiffness: 45,
              }}
            >
              <Link href={`https://instagram.com/${user.name}`} target="_blank">
                {user.match && parseInt(user.match.per) > 70 ? (
                  <Button>Let&apos;s Connect 🫂</Button>
                ) : (
                  <Button>🙉</Button>
                )}
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: "100dvh", filter: "blur(10px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{
              duration: 1,
              delay: 11,
              type: "spring",
              stiffness: 45,
            }}
            onClick={() => (
              setMatch(false), (document.body.style.overflow = "")
            )}
            className=" absolute bottom-4 cursor-pointer"
          >
            <X />
          </motion.div>
          <motion.div
            initial={{ y: "-100dvh", filter: "blur(10px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{
              duration: 1,
              delay: 11,
              type: "spring",
              stiffness: 45,
            }}
            className=" cursor-pointer hover:text-zinc-100 absolute top-4 flex text-xs gap-1 text-zinc-400 items-center"
          >
            <Info className=" h-4 w-4" /> based on your interests
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Particles;
