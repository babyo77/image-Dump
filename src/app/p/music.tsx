"use client";
import { Dot } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePlayCircle, MdPauseCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";
import { user } from "../types/types";
function Music({ user }: { user: user }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const handlePlay = async () => {
    const music = audioRef.current;
    if (music && user.usersDoc.music) {
      music.currentTime = Number(user.usersDoc.music.start);
      music.play();
    }
  };

  useEffect(() => {
    const music = audioRef.current;

    if (music) {
      const handleEnd = () => {
        if (
          user.usersDoc.music &&
          Math.floor(music.currentTime) ==
            Math.floor(Number(user.usersDoc.music.end))
        ) {
          music.pause();
        }
      };
      music.addEventListener("timeupdate", handleEnd);
      return () => {
        music.removeEventListener("timeupdate", handleEnd);
      };
    }
  }, [user]);

  return (
    <motion.div
      initial={{ y: "5dvh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 1,
        type: "spring",
        stiffness: 45,
      }}
      exit={{ y: "5dvh", opacity: 0 }}
      className=" flex gap-0.5 ml-[0.257rem] items-center -my-1.5"
    >
      <audio
        src={user.usersDoc.music?.youtubeId}
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
        href={`https://napster-drx.vercel.app/track/${user.usersDoc.music?.audio}`}
        className=" hover:underline-offset-2 hover:underline cursor-pointer flex text-xs items-center max-w-[70dvw] truncate"
      >
        <span>{user.usersDoc.music?.title}</span>
        <Dot size={17} className="-mx-0.5" />{" "}
        <span className="text-zinc-400">
          {user.usersDoc.music?.artists[0].name}
        </span>
      </Link>
    </motion.div>
  );
}

export default Music;
