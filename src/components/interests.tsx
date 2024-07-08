"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useCallback, useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { account, database } from "@/lib/client/appwrite";
import { TiPointOfInterest } from "react-icons/ti";
import { user } from "@/app/types/types";
import { motion } from "framer-motion";
import { confettiAnimation } from "./ui/confettiAnimation";
import { Loader } from "lucide-react";
import TagsInput from "./ui/Addtags";
import { useMediaQuery } from "@react-hook/media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";

function Interests({
  isOpen,
  user,
  className,
}: {
  className?: string;
  isOpen?: boolean;
  user: user;
}) {
  const [interested, setInterest] = useState<string[]>(user.usersDoc.interests);
  const CloseRef = useRef<HTMLButtonElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(user.name);

  const handleContinue = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (interested.length <= 1) {
        toast.error("Minimum 2 interest required to continue");
        return;
      }
      try {
        setLoader(true);
        const isExist = await fetch(`/api/check?u=${username}`, {
          cache: "no-cache",
        });
        if (isExist.status === 404) {
          await account.updateName(username);
        } else {
          toast.error("username already in taken");
          return;
        }
        await database.updateDocument(
          process.env.DATABASE_ID || "",
          process.env.USERS_ID || "",
          user.$id,
          {
            interests: interested,
          }
        );
        if (CloseRef.current) {
          confettiAnimation();
          CloseRef.current.click();
        }
      } catch (error) {
        toast.error("Failed to save interest");
      } finally {
        setLoader(false);
      }
    },
    [interested, user, username]
  );

  const handleKeywordsChange = (newKeywords: string[]) => {
    setInterest(newKeywords);
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <AlertDialog defaultOpen={isOpen}>
        <AlertDialogTrigger
          className={className?.replace("hidden", "")}
          style={{
            visibility: className == "hidden" ? "hidden" : "visible",
            position: className == "hidden" ? "absolute" : "static",
          }}
        >
          <TiPointOfInterest className="h-7 w-7" />
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[90dvw] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Details</AlertDialogTitle>
          </AlertDialogHeader>
          <motion.form
            onSubmit={handleContinue}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className=" relative mb-3  space-y-3">
              <Input
                placeholder="Username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                name="username"
              />

              <TagsInput
                initialKeywords={interested}
                onKeywordsChange={handleKeywordsChange}
                placeholder="Type interest and hit enter"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                ref={CloseRef}
                style={{ visibility: "hidden", position: "absolute" }}
              ></AlertDialogCancel>
              <AlertDialogCancel
                disabled={interested.length <= 1}
                className={` bg-zinc-900 outline-none ring-0  rounded-xl hover:bg-zinc-800 ${className} text-white`}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                disabled={loader}
                className=" bg-zinc-900 border rounded-xl text-white hover:bg-zinc-800"
              >
                {loader ? <Loader className=" animate-spin h-5 w-5" /> : "Save"}
              </Button>
            </AlertDialogFooter>
          </motion.form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger
        className={className?.replace("hidden", "")}
        style={{
          visibility: className == "hidden" ? "hidden" : "visible",
          position: className == "hidden" ? "absolute" : "static",
        }}
      >
        <TiPointOfInterest className="h-7 w-7" />
      </DrawerTrigger>
      <DrawerContent className=" border-none">
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
          <DrawerDescription></DrawerDescription>

          <motion.form
            onSubmit={handleContinue}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className=" relative mb-3 mt-1 space-y-3">
              <Input
                placeholder="Username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
              />
              <TagsInput
                initialKeywords={interested}
                onKeywordsChange={handleKeywordsChange}
                placeholder="Type interest and hit enter"
              />
            </div>
            <Button
              disabled={loader}
              className=" bg-zinc-900 w-full border rounded-xl text-white hover:bg-zinc-800"
            >
              {loader ? <Loader className=" animate-spin h-5 w-5" /> : "Save"}
            </Button>
          </motion.form>
        </DrawerHeader>

        <DrawerClose
          ref={CloseRef}
          style={{ visibility: "hidden", position: "absolute" }}
        ></DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

export default Interests;
