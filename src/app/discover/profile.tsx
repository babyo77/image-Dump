"use client";
import React from "react";
import { discover, user } from "../types/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { PiStack } from "react-icons/pi";
import { popup } from "@/components/ui/popup";

function Profile({
  loggedIn,
  discover,
}: {
  loggedIn?: user | null;
  discover: discover[];
}) {
  return (
    <div className="p-5">
      <div className=" w-full flex leading-tight tracking-tighter justify-between pb-5 md:px-10">
        <motion.p
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className=" font-semibold text-3xl gap-0.5 flex items-center"
        >
          <PiStack />
          DUMP
        </motion.p>
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex items-center gap-2"
        >
          <Button
            size={"sm"}
            onClick={() => (
              popup.show(),
              popup.updateMessage("A place to chill with friends and stranger.")
            )}
          >
            Switch to Space
          </Button>
        </motion.div>
      </div>
      <div className="flex max-md:flex-col md:flex-wrap w-full items-center no-scrollbar h-[100dvh] overflow-y-scroll md:justify-center max-md:snap-y max-md:snap-mandatory scroll-smooth text-center text-neutral-200 gap-4">
        {discover.map((user, i) => (
          <motion.div
            initial={{ y: "5dvh", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 1,
              delay: Number(`1.${i}`),
              type: "spring",
              stiffness: 45,
            }}
            exit={{ y: "5dvh", opacity: 0 }}
            key={user.$id}
            className={`${i === discover.length - 1 && "max-md:mb-24"} ${
              i === 0 && ""
            } relative rounded-xl snap-start scroll-smooth overflow-hidden md:w-[22dvw] min-h-[80dvh] border w-full`}
          >
            <Link href={`/p/${user.username}`} target="_blank">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${user.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.6,
                }}
              ></div>
            </Link>

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
        {/* <Profile user={user} /> */}
      </div>
    </div>
  );
}

export default Profile;
