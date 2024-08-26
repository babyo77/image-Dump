"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IoIosStarOutline } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { Links } from "@/components/links";
import { AnimatePresence, motion } from "framer-motion";
import { useUserContext } from "@/store/context";
import { replaceInstagramURL } from "@/lib/utils";
import Gallery from "../gallery";
import useDebounce from "@/app/hooks/useDebounce";
import Music from "../music";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import sendEmail from "@/lib/sendMail";
import { IUser } from "@/lib/models/userModel";
function User({ user }: { user: IUser }) {
  const { match, setMatch, country } = useUserContext();
  const router = useRouter();
  const [starred, setStarred] = useState<boolean>(user.isStarred || false);
  const Like = useCallback(async () => {
    if (user.loggedInUser) {
      const likePayload = {
        type: starred ? "unStar" : "star",
        data: {
          userId: user.loggedInUser._id,
          starredId: user._id,
        },
      };

      const res = await fetch(`/api/update`, {
        method: "PATCH",
        body: JSON.stringify(likePayload),
      });
    } else {
      router.push("/login");
    }
  }, [user, starred, router]);

  const [activity, setActivity] = useState<boolean>(false);
  const handleMatch = async () => {
    if (user.loggedInUser && user.match && user.match !== null) {
      setMatch(true);
      document.body.style.overflow = "hidden";
      if (!activity) {
        sendEmail(user.email, "You have a new Match", {
          actionByName: user.loggedInUser?.name,
          actionToName: user.username,
          match: user.match?.per || "1",
        });

        try {
          // const res = await database.createDocument(
          //   process.env.DATABASE_ID || "",
          //   process.env.ACTIVITY_ID || "",
          //   ID.unique(),
          //   {
          //     type: "match",
          //     actionBy: user.loggedInUser.$id,
          //     actionByName: user.loggedInUser.name,
          //     actionToName: user.name,
          //     actionTo: user.$id,
          //     match: user.match.per,
          //     users: [user.$id, user.loggedInUser.$id],
          //   }
          // );
          // if (res) {
          //   setActivity(true);
          // }
        } catch (error) {
          setActivity(false);
        }
      }
    } else {
      router.push("/login");
    }
  };
  const [fullImage, setFullImage] = useState<boolean>(false);
  const handleLike = useDebounce(Like, 400);
  useEffect(() => {
    if (fullImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [fullImage]);
  const handleShare = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    const url = window.location.origin + "/p/" + user.username;
    try {
      if (navigator.canShare()) {
        navigator.share({
          url,
        });
      } else {
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link copied to clipboard");
        });
      }
    } catch (error) {
      //@ts-expect-error:expected-error
      toast.error(error.message);
    }
  };

  return (
    <>
      {fullImage && (
        <div
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={(e) => (e.stopPropagation(), setFullImage(false))}
          className=" fixed overflow-hidden w-full h-full bg-black/90 z-50 flex items-center justify-center flex-col gap-4 cursor-pointer"
        >
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
              stiffness: 45,
            }}
            className="h-48 w-48 rounded-full overflow-hidden"
          >
            <Image
              height={500}
              width={500}
              alt="profile"
              src={replaceInstagramURL(user.image) || "/notFound.jpg"}
              onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
              className=" h-[100%] w-[100%] object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
              stiffness: 45,
            }}
            className=" rounded-xl text-base bg-zinc-900/90 overflow-hidden"
          >
            <p
              onClick={handleShare}
              className="p-2 px-5 cursor-pointer hover:bg-zinc-800/50 transition-all duration-500"
            >
              Share profile
            </p>
            <div className="h-[0.05rem] bg-zinc-700"></div>
            <p
              onClick={(e) => (e.stopPropagation(), handleMatch())}
              className="p-2 px-5 cursor-pointer hover:bg-zinc-800/50 transition-all duration-500"
            >
              Are you a match?
            </p>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {!match && (
          <div className="px-7 pt-11 flex pb-7 justify-start overflow-hidden items-start">
            <div className="cursor-pointer absolute flex-col items-center gap-2.5 hover:text-zinc-300 transition-all right-4 duration-300">
              <div className="flex flex-col items-center gap-2 z-20">
                <motion.div
                  key={"star"}
                  initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7,
                    stiffness: 45,
                  }}
                  exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                  className=" z-20"
                >
                  {starred ? (
                    <IoStar
                      onClick={() => (
                        user.loggedInUser && setStarred(false), handleLike()
                      )}
                      className="h-7 w-7 text-yellow-400  transition-all duration-500"
                    />
                  ) : (
                    <IoIosStarOutline
                      onClick={() => (
                        user.loggedInUser && setStarred(true), handleLike()
                      )}
                      className="h-7 w-7 text-zinc-400 hover:text-zinc-200 transition-all duration-500"
                    />
                  )}
                </motion.div>
                <motion.div
                  key={"match"}
                  initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7,
                    stiffness: 45,
                  }}
                  exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                  className=" z-20"
                >
                  <HeartHandshake
                    onClick={handleMatch}
                    className=" h-6 w-6 text-zinc-400 hover:text-zinc-200 transition-all duration-500"
                  />
                </motion.div>
              </div>
            </div>
            <motion.div
              key={"image"}
              initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                stiffness: 45,
              }}
              exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
              className=" gap-5 flex flex-col"
            >
              <div className="h-32 w-32 rounded-full overflow-hidden">
                <Image
                  onClick={() => setFullImage(true)}
                  height={500}
                  width={500}
                  alt="profile"
                  src={replaceInstagramURL(user.image) || "/notFound.jpg"}
                  onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
                  className=" h-[100%] w-[100%] object-cover cursor-pointer"
                />
              </div>

              <motion.div
                key={"name"}
                initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7,
                  stiffness: 45,
                }}
                exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                translate="no"
                className="font-semibold w-fit outline-none text-3xl py-0.5 pl-1.5 border-none -mt-2"
              >
                <p className="w-[75dvw] break-words">{user.fullName}</p>
              </motion.div>
              <motion.div
                key={"bio"}
                initial={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7,
                  stiffness: 45,
                }}
                exit={{ y: 0, filter: "blur(10px)", opacity: 0 }}
                translate="no"
                className="dark:text-zinc-100/95 w-fit outline-none border-none text-lg pl-1.5 -mt-4"
              >
                {user.bio.length > 0 && (
                  <div>
                    {" "}
                    {user.bio.split("\n").map((line, index) => (
                      <p className=" w-[75dvw] break-words" key={index}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
              <Links details={user} loggedIn={false} />
              {user.music && <Music user={user} />}
              <Gallery user={user} />
            </motion.div>
          </div>
        )}
        {!match && (
          <motion.footer
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.1,

              stiffness: 45,
            }}
            exit={{ y: 0, opacity: 0 }}
            key={"footer"}
            className="flex w-full  items-center justify-center bottom-0 pb-7"
          >
            <Link href={"/login"} target="_blank">
              <Button size={"sm"}>Create your own imageDump</Button>
            </Link>
          </motion.footer>
        )}
      </AnimatePresence>
    </>
  );
}

export default User;
