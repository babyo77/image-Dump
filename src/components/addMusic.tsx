"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { searchSong } from "napster-info";
import { SearchSong } from "napster-info/dist/types";
import useDebounce from "@/app/hooks/useDebounce";
import { motion } from "framer-motion";
import { useMediaQuery } from "@react-hook/media-query";
import { MdOutlinePlayCircle } from "react-icons/md";
import { Loader, PauseCircle, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { database } from "@/lib/client/appwrite";
import { useUserContext } from "@/store/context";
import { Slider } from "./ui/slider";
const AddMusic = forwardRef<HTMLButtonElement, {}>(({}, ref) => {
  const [searchedSongs, setSearchedSong] = useState<SearchSong[] | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const song = e.target.value;
    if (song.trim().length > 0) {
      try {
        setLoader(true);
        const songs = await searchSong(song);
        setSearchedSong(songs);
      } catch (error) {
        //@ts-expect-error:expected error
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };
  const handleSearch = useDebounce(search, 500);
  useEffect(() => {
    searchSong("baby").then((music) => {
      setSearchedSong(music);
    });
  }, []);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger ref={ref}></DialogTrigger>
        <DialogContent
          aria-describedby="music"
          aria-description="music"
          className="w-[40dvw] rounded-xl "
        >
          <DialogHeader>
            <DialogTitle>Music</DialogTitle>
            <DialogDescription
              id="music"
              aria-describedby="music"
              aria-description="music"
            ></DialogDescription>
            <motion.div
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.4 }}
              className=" flex flex-col gap-4"
            >
              <div className=" relative">
                <Input
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search song"
                />
                {loader && (
                  <div className=" absolute right-2 bottom-2.5">
                    <Loader className=" animate-spin h-5 w-5 text-zinc-500" />
                  </div>
                )}
              </div>
              <div
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
                }}
                className=" flex flex-col gap-1.5 pt-3 w-full -mt-2 max-h-[50dvh] pb-2 overflow-y-scroll no-scrollbar"
              >
                {searchedSongs?.map(
                  ({ audio, title, artists, thumbnailUrl, youtubeId }) => (
                    <motion.div
                      initial={{ filter: "blur(10px)", opacity: 0 }}
                      animate={{ filter: "blur(0px)", opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      key={audio}
                      className=" flex cursor-pointer gap-2 items-center"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-sm">
                        <Image
                          alt={title}
                          height={500}
                          width={500}
                          src={thumbnailUrl || "/notFound.jpg"}
                          onError={(e) =>
                            (e.currentTarget.src = "/notFound.jpg")
                          }
                        />
                      </div>
                      <div className=" flex justify-between w-full items-center">
                        <div className=" leading-tight">
                          <p className=" text-sm max-w-[25dvw]  truncate">
                            {title}
                          </p>
                          <p className="text-xs  max-w-[20dvw] truncate text-zinc-400">
                            {artists[0]?.name}
                          </p>
                        </div>
                        <div className=" flex flex-col items-center justify-center">
                          <AddMusicButton
                            close={closeRef}
                            music={{
                              audio,
                              title,
                              thumbnailUrl,
                              artists,
                              youtubeId,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </DialogHeader>
          <DrawerClose ref={closeRef} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger ref={ref}></DrawerTrigger>
      <DrawerContent aria-description="music" className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Music</DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.4 }}
            className=" flex flex-col gap-4"
          >
            <div className=" relative">
              <Input
                onChange={handleSearch}
                type="text"
                placeholder="Search song"
              />
              {loader && (
                <div className=" absolute right-1.5 bottom-2">
                  <Loader className=" animate-spin text-zinc-500" />
                </div>
              )}
            </div>
            <div
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 95%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, black 95%, transparent 100%)",
              }}
              className=" flex flex-col gap-1.5 items-start  max-h-[50dvh] pb-2 overflow-y-scroll no-scrollbar"
            >
              {searchedSongs?.map(
                ({ audio, title, artists, thumbnailUrl, youtubeId }) => (
                  <motion.div
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    key={audio}
                    className=" flex cursor-pointer gap-2 w-full items-center"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-sm">
                      <Image
                        alt={title}
                        height={500}
                        width={500}
                        src={thumbnailUrl || "/notFound.jpg"}
                        onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
                      />
                    </div>
                    <div className=" flex justify-between w-full items-center">
                      <div className=" leading-tight text-start">
                        <p className=" text-sm max-w-[65dvw] truncate">
                          {title}
                        </p>
                        <p className="text-xs max-w-[60dvw] truncate text-zinc-400">
                          {artists[0]?.name}
                        </p>
                      </div>
                      <div className=" flex flex-col items-center justify-center">
                        <AddMusicButton
                          close={closeRef}
                          music={{
                            audio,
                            title,
                            thumbnailUrl,
                            artists,
                            youtubeId,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </DrawerHeader>
        <DrawerClose ref={closeRef} />
      </DrawerContent>
    </Drawer>
  );
});

const AddMusicButton = ({
  music,
  close,
}: {
  music: SearchSong;
  close: React.RefObject<HTMLButtonElement>;
}) => {
  const [adding, setAdding] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);

  const [localValues, setLocalValues] = useState<number[]>([0, 27]);

  const handleAdd = async () => {
    if (user) {
      try {
        setAdding(true);
        await database.updateDocument(
          process.env.DATABASE_ID || "",
          process.env.USERS_ID || "",
          user.$id,
          {
            music: [
              music.audio,
              String(localValues[0]),
              String(localValues[1]),
            ],
          }
        );
        closeRef.current?.click();
        close.current?.click();
      } catch (error) {
        //@ts-expect-error:expected-error
        toast.error(error.message);
      } finally {
        setAdding(false);
      }
    }
  };

  const handleChange = (e: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e[0]) ?? 0;
      setLocalValues(e);
    }
  };
  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog onOpenChange={handlePlay}>
        <DialogTrigger className="px-0.5">
          {playing ? (
            <PauseCircle className="h-6 w-6 text-zinc-500" />
          ) : (
            <PlayCircle className="h-6 w-6 hover:text-zinc-200 text-zinc-500" />
          )}
        </DialogTrigger>
        <DialogContent
          aria-description="music"
          aria-describedby="music"
          className="w-[40dvw] rounded-xl"
        >
          <audio
            autoPlay
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => (
              setDuration(e.currentTarget.duration),
              (e.currentTarget.currentTime = duration / 2),
              setProgress(e.currentTarget.duration / 2)
            )}
            onTimeUpdate={(e) => (
              setProgress(e.currentTarget.currentTime),
              setLocalValues([
                e.currentTarget.currentTime,
                e.currentTarget.currentTime + 27,
              ])
            )}
            src={music.youtubeId}
            ref={audioRef}
            hidden
          ></audio>
          <DialogHeader>
            <DialogTitle>
              <div className=" flex justify-between items-center">
                <p>Add Song</p>
              </div>
            </DialogTitle>
            <DialogDescription
              id="music"
              aria-description="music"
              aria-describedby="music"
            ></DialogDescription>
          </DialogHeader>
          <div>
            <div className=" flex w-full flex-col gap-2 items-center justify-center">
              <div className="h-14 w-14 overflow-hidden rounded-md">
                <Image
                  alt="image"
                  height={500}
                  width={500}
                  src={music?.thumbnailUrl || "/notFound.jpg"}
                  onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
                />
              </div>
              <div className=" leading-tight text-center px-1.5">
                <p>{music?.title}</p>
                <p className="text-xs text-zinc-400">
                  {music?.artists[0]?.name}
                </p>
              </div>
              <div className="flex w-full gap-1.5 px-3.5 pb-4 justify-between items-center">
                <div onClick={handlePlay}>
                  {playing ? (
                    <PauseCircle className="w-5 cursor-pointer h-5" />
                  ) : (
                    <PlayCircle className="w-5 cursor-pointer h-5" />
                  )}
                </div>
                <div className="text-[.5rem] leading-tight font-medium ">
                  <p>{formatTime(progress)}</p>
                </div>
                <Slider
                  minStepsBetweenThumbs={20}
                  onValueChange={handleChange}
                  defaultValue={[duration / 2, progress + 27]}
                  value={[progress, progress + 27]}
                  max={duration}
                  className=" cursor-pointer"
                />
                <div className="text-[.5rem]  font-medium leading-tight">
                  <p>{formatTime(duration)}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              ref={closeRef}
              className="text-zinc-400 text-base font-medium hover:text-zinc-100"
            >
              Cancel
            </DialogClose>
            <p className="text-zinc-400 tex-xs font-medium hover:text-zinc-100">
              <Button
                variant={"secondary"}
                disabled={adding}
                onClick={handleAdd}
                className="bg-transparent m-0 w-11 flex justify-end items-end  hover:bg-transparent hover:text-zinc-100 text-zinc-400 px-0 text-base"
              >
                {adding ? <Loader className=" animate-spin h-5 w-5" /> : "Done"}
              </Button>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer onClose={() => audioRef.current?.pause()}>
      <DrawerTrigger className="px-0.5">
        {playing ? (
          <PauseCircle className="h-6 w-6 text-zinc-500" />
        ) : (
          <PlayCircle className="h-6 w-6 hover:text-zinc-200 text-zinc-500" />
        )}
      </DrawerTrigger>
      <DrawerContent
        aria-description="music"
        aria-describedby="music"
        className=" border-none"
      >
        <audio
          autoPlay
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => (
            setDuration(e.currentTarget.duration),
            (e.currentTarget.currentTime = duration / 2),
            setProgress(e.currentTarget.duration / 2)
          )}
          onTimeUpdate={(e) => (
            setProgress(e.currentTarget.currentTime),
            setLocalValues([
              e.currentTarget.currentTime,
              e.currentTarget.currentTime + 27,
            ])
          )}
          src={music.youtubeId}
          ref={audioRef}
          hidden
        ></audio>
        <DrawerHeader>
          <DrawerTitle>
            <div className=" flex justify-between items-center">
              <DrawerClose
                ref={closeRef}
                className="text-zinc-400 text-base font-medium hover:text-zinc-100"
              >
                Cancel
              </DrawerClose>
              <p>Add Song</p>
              <p className="text-zinc-400 tex-xs font-medium hover:text-zinc-100">
                <Button
                  variant={"secondary"}
                  disabled={adding}
                  onClick={handleAdd}
                  className="bg-transparent m-0 w-11 flex justify-end items-end  hover:bg-transparent hover:text-zinc-100 text-zinc-400 px-0 text-base"
                >
                  {adding ? (
                    <Loader className=" animate-spin h-5 w-5" />
                  ) : (
                    "Done"
                  )}
                </Button>
              </p>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div>
          <div className=" flex w-full flex-col gap-2 items-center justify-center">
            <div className="h-14 w-14 overflow-hidden rounded-md">
              <Image
                alt="image"
                height={500}
                width={500}
                src={music?.thumbnailUrl || "/notFound.jpg"}
                onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
              />
            </div>
            <div className=" leading-tight text-center px-1.5">
              <p>{music?.title}</p>
              <p className="text-xs text-zinc-400">{music?.artists[0]?.name}</p>
            </div>
            <div className="flex w-full gap-1.5 px-3.5 pb-4 justify-between items-center">
              <div onClick={handlePlay}>
                {playing ? (
                  <PauseCircle className="w-5 h-5" />
                ) : (
                  <PlayCircle className="w-5 h-5" />
                )}
              </div>
              <div className="text-[.5rem] leading-tight font-medium ">
                <p>{formatTime(progress)}</p>
              </div>
              <Slider
                minStepsBetweenThumbs={20}
                onValueChange={handleChange}
                defaultValue={[duration / 2, progress + 27]}
                value={[progress, progress + 27]}
                max={duration}
                className=" cursor-pointer"
              />
              <div className="text-[.5rem] font-medium leading-tight">
                <p>{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

AddMusic.displayName = "AddMusic";

export default AddMusic;
