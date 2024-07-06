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
import { Models } from "node-appwrite";
import { database } from "@/lib/client/appwrite";
import { TiPointOfInterest } from "react-icons/ti";
import { user } from "@/app/types/types";
import { motion } from "framer-motion";
import { confettiAnimation } from "./ui/confettiAnimation";
import { Loader } from "lucide-react";
import TagsInput from "./ui/Addtags";
interface search extends Models.Document {
  text: string;
}
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

  /**
   * search will add later
   */

  // const interestRef = useRef<HTMLInputElement>(null);
  // const [defaultInterests, setDefaultInterest] = useState<search[] | null>(
  //   null
  // );

  // const addInterest = () => {
  //   const interestValue = interestRef.current?.value;
  //   if (interestValue && interestValue.trim().length > 0) {
  //     if (interested.includes(capitalizeWords(interestValue))) {
  //       toast.error("already added");
  //       return;
  //     }
  //     setInterest((prev) => [capitalizeWords(interestValue), ...prev]);
  //     interestRef.current.value = "";
  //     setDefaultInterest(null);
  //   }
  // };

  // const removeInterest = (interestToRemove: string) => {
  //   setInterest((prev) =>
  //     prev.filter((interest) => interest !== interestToRemove)
  //   );
  //   setDefaultInterest(null);
  // };

  // const Search = async () => {
  //   if (interestRef.current) {
  //     const search = interestRef.current.value;
  //     if (search.trim().length > 0) {
  //       const data = await database.listDocuments(
  //         process.env.DATABASE_ID || "",
  //         "6676ce740002d504bc6f",
  //         [Query.startsWith("text", search)]
  //       );
  //       setDefaultInterest(data.documents as search[]);
  //     } else {
  //       setDefaultInterest(null);
  //     }
  //   }
  // };

  // const handleSet = (e: React.MouseEvent<HTMLSpanElement>) => {
  //   if (interestRef.current) {
  //     interestRef.current.value = e.currentTarget.textContent || "";
  //     addInterest();
  //   }
  // };

  // const handleSearch = useDebounce(Search, 400);

  const handleContinue = useCallback(async () => {
    if (interested.length <= 1) {
      toast.error("Minimum 2 interest required to continue");
      return;
    }
    try {
      setLoader(true);
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
  }, [interested, user]);

  const handleKeywordsChange = (newKeywords: string[]) => {
    setInterest(newKeywords);
  };
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
      <AlertDialogContent className="w-[0dvw] rounded-xl ">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Interests</AlertDialogTitle>
          <AlertDialogDescription>
            This will be used to discover people with similar interests.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className=" relative mb-3">
            <TagsInput
              // onChange={handleSearch}
              initialKeywords={interested}
              onKeywordsChange={handleKeywordsChange}
              placeholder="Type interest and hit enter"
            />
            {/* {defaultInterests && defaultInterests.length > 0 && (
              <div className=" absolute bg-zinc-900/95 border-2 max-h-32 overflow-x-hidden  overflow-y-scroll no-scrollbar w-full z-10 text-sm rounded-xl mt-1 flex flex-col">
                <>
                  {defaultInterests.map(({ text }, i) => (
                    <span
                      onClick={handleSet}
                      key={text + i}
                      className={`${
                        i === defaultInterests.length - 1 ? "" : "border-b"
                      } px-5 py-1.5 hover:bg-zinc-800 cursor-pointer`}
                    >
                      {text}
                    </span>
                  ))}
                </>
              </div>
            )} */}
            {/* <div className=" flex bottom-1.5 right-1 absolute gap-1">
              <Button
                onClick={() => setInterest([])}
                size={"sm"}
                disabled={interested.length === 0}
                variant={"secondary"}
                className="  border text-xs px-4 h-7 rounded-lg"
              >
                Remove all
              </Button>
              <Button
                onClick={addInterest}
                size={"sm"}
                variant={"secondary"}
                className="  border text-xs px-4 h-7 rounded-lg"
              >
                Add
              </Button>
            </div> */}
          </div>
        </motion.div>
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
            className=" bg-zinc-900 border rounded-xl text-white hover:bg-zinc-800"
            onClick={handleContinue}
          >
            {loader ? <Loader className=" animate-spin h-5 w-5" /> : "Save"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Interests;
