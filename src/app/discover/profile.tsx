"use client";
import React from "react";
import { discover, user } from "../types/types";
import Image from "next/image";
import { replaceInstagramURL } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Button } from "@/components/ui/button";
function Profile({
  user,
  discover,
}: {
  user?: user | null;
  discover: discover[];
}) {
  return (
    <div className="">
      {/* <div className=" w-full flex leading-tight tracking-tighter justify-between px-5 pb-4">
        <motion.p
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className=" font-semibold text-3xl"
        >
          Discover
        </motion.p>
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="h-8 w-8 rounded-full  overflow-hidden"
        >
          <Link href={"/p"}>
            <Image
              height={500}
              width={500}
              alt="profile"
              src={
                user
                  ? replaceInstagramURL(user.prefs["image"])
                  : "/notFound.jpg"
              }
              onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
              className=" h-[100%] w-[100%] object-cover"
            />
          </Link>
        </motion.div>
      </div> */}
      <div className="flex flex-col w-full items-center no-scrollbar h-[100dvh] overflow-scroll justify-start snap-y snap-mandatory scroll-smooth text-center text-neutral-200 gap-4">
        {discover.map((user, i) => (
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            key={user.$id}
            className={`${i === discover.length - 1 && "mb-5"} ${
              i === 0 && "mt-5"
            } relative rounded-xl snap-center scroll-smooth overflow-hidden md:w-[24dvw] min-h-[90dvh] w-[90dvw] border`}
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
                  {user ? "View your profile" : "Get your own"}
                </Button>
              </Link>
            </div>
            <div className=" absolute bottom-0 tracking-tight w-full text-start py-4 px-3">
              <p className=" text-4xl font-semibold break-words">
                {user.fullName}
              </p>
              <Link
                href={`https://www.instagram.com/${user.username}`}
                target="_blank"
              >
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
