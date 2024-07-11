"use client";

import Interests from "@/components/interests";
import { Bell, Compass, Lock } from "lucide-react";
import Link from "next/link";
import { user } from "../types/types";
import { motion } from "framer-motion";
import { ProfileAnalytics } from "./details";
import { popup } from "@/components/ui/popup";
function AnimatedInterests({ user }: { user: user }) {
  return (
    <div className=" flex flex-col items-center gap-1">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
          stiffness: 45,
        }}
        exit={{ y: 0, opacity: 0 }}
      >
        <Interests
          className="text-zinc-400 hover:text-zinc-200"
          user={user}
          isOpen={user.usersDoc.interests.length < 2 ? true : false}
        />
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
          stiffness: 45,
        }}
        exit={{ y: 0, opacity: 0 }}
      >
        <Link href={"/discover"}>
          <Compass className=" h-[1.4rem] w-[1.4rem] ml-0.5 -mt-1 text-zinc-400 hover:text-zinc-200" />
        </Link>
        <ProfileAnalytics user={user} />
        <Bell
          onClick={() => (
            popup.show(),
            popup.updateMessage("Know who saw your profile and more!")
          )}
          className="text-zinc-400 hover:text-zinc-200 mt-1"
        />
      </motion.div>
    </div>
  );
}

export default AnimatedInterests;
