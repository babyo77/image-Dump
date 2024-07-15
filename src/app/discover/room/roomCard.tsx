import Image from "next/image";
import { MapPinned, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@react-hook/media-query";
import { motion } from "framer-motion";
import { roomCard } from "@/app/types/types";

export const RoomCard: React.FC<roomCard> = ({
  id,
  index,
  name,
  speakers,
  listeners,
  location,
  ownerId,
  total,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      key={index}
      initial={{
        y: isDesktop ? "5dvh" : 0,
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.5,
        delay: Number(`${Math.floor(index / 10) + 1}.${index % 10}`),
        type: "spring",
        stiffness: 45,
      }}
      exit={{ y: isDesktop ? "5dvh" : 0, opacity: 0 }}
      className=" rounded-xl min-h-52 md:min-w-[22.1dvw] bg-neutral-900 p-5 border relative"
    >
      <p className="break-words font-medium md:max-w-[19.2dvw]">
        {name.length >= 80 ? name.slice(0, 80) + "..." : name}
      </p>
      <motion.div
        key={index + 1}
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.7,
          stiffness: 45,
        }}
        exit={{ y: 0, opacity: 0 }}
        className="flex  cursor-pointer w-fit font-normal leading-tight dark:text-zinc-300 items-center text-sm pt-2.5 pb-1.5"
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
            <AvatarFallback className=" bg-zinc-800">!</AvatarFallback>
          </Avatar>
        ))}
      </motion.div>
      <div className=" text-sm text-neutral-300">
        <p>tanmay,tony,aman</p>
      </div>
      <div className=" absolute bottom-2 right-2 flex items-center text-base text-neutral-300">
        {total} <User className="h-4" />
      </div>
      <div className=" absolute bottom-2 capitalize left-2 flex items-center text-base text-neutral-400">
        <MapPinned className="h-4" /> {location}
      </div>
    </motion.div>
  );
};
