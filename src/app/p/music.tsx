"use client";
import { Dot } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePlayCircle, MdPauseCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUserContext } from "@/store/context";
import { IUser } from "@/lib/models/userModel";
function Music({ user }: { user: IUser }) {
  const { user: contextUser } = useUserContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const handlePlay = async () => {
    const music = audioRef.current;
    if (music && contextUser?.music) {
      music.currentTime = Number(contextUser.music.start);
      music.play();
    }
  };

  useEffect(() => {
    const music = audioRef.current;

    if (music) {
      const handleEnd = () => {
        if (
          user.music &&
          Math.floor(music.currentTime) ==
            Math.floor(Number(contextUser?.music?.end || user.music.end))
        ) {
          music.pause();
        }
      };
      music.addEventListener("timeupdate", handleEnd);
      return () => {
        music.removeEventListener("timeupdate", handleEnd);
      };
    }
  }, [user, contextUser]);

  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.7,
        stiffness: 45,
      }}
      exit={{ y: 0, opacity: 0 }}
      className=" flex gap-0.5 ml-[0.257rem] items-center -my-1.5"
    >
      <audio
        src={contextUser?.music?.youtubeId || user.music?.youtubeId}
        onPlaying={() => setPlaying(true)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        ref={audioRef}
      ></audio>
      <div>
        {playing ? (
          <MdPauseCircleOutline
            onClick={() => audioRef.current && audioRef.current.pause()}
            className=" cursor-pointer"
          />
        ) : (
          <MdOutlinePlayCircle
            onClick={handlePlay}
            className=" cursor-pointer"
          />
        )}
      </div>
      <Link
        target="_blank"
        href={`https://napster-drx.vercel.app/track/${
          contextUser?.music?.audio || user.music?.audio
        }`}
        className=" hover:underline-offset-2 hover:underline cursor-pointer flex text-xs items-center max-w-[70dvw] truncate"
      >
        <span>
          {contextUser?.music?.title || user.music?.title || "unknown"}
        </span>
        <Dot size={17} className="-mx-0.5" />{" "}
        <span className="text-zinc-400">
          {contextUser?.music?.artists[0]?.name ||
            user.music?.artists[0]?.name ||
            "unknown"}
        </span>
      </Link>
    </motion.div>
  );
}

export default Music;
