"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useDebounce from "../hooks/useDebounce";
import { Links } from "@/components/links";
import { AnimatePresence, motion } from "framer-motion";
import { replaceInstagramURL, showError } from "@/lib/utils";
import Image from "next/image";
import { useUserContext } from "@/store/context";
import Music from "./music";
import { IUser } from "@/lib/models/userModel";
import { upload } from "../types/types";

function Details({ details }: { details: IUser }) {
  const fullNameRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const { setLoader, loader, user } = useUserContext();

  const changeUsername = useCallback(async () => {
    const name = fullNameRef.current?.textContent;
    try {
      setLoader(true);
      const response = await fetch("/api/update", {
        method: "PATCH",
        body: JSON.stringify({ type: "name", data: name }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoader(false);
    }
  }, [setLoader]);
  const changeBio = useCallback(async () => {
    const bio = bioRef.current?.innerText;
    try {
      setLoader(true);
      const response = await fetch("/api/update", {
        method: "PATCH",
        body: JSON.stringify({ type: "bio", data: bio }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoader(false);
    }
  }, [setLoader]);
  const handleChangeUsername = useDebounce(changeUsername);
  const handleChangeBio = useDebounce(changeBio);

  useEffect(() => {
    const fullNameElement = fullNameRef.current;
    const bioElement = bioRef.current;

    if (fullNameElement && bioElement) {
      fullNameElement.addEventListener("input", handleChangeUsername);
      bioElement.addEventListener("input", handleChangeBio);
    }

    return () => {
      if (fullNameElement && bioElement) {
        fullNameElement.removeEventListener("input", handleChangeUsername);
        bioElement.removeEventListener("input", handleChangeBio);
      }
    };
  }, [handleChangeUsername, handleChangeBio]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      if (loader) return;
      const image = e.target.files[0];
      if (!image.type.startsWith("image")) {
        toast.error("Please upload a valid image file.");
        return;
      }
      const formData = new FormData();
      formData.append(
        "payload_json",
        JSON.stringify({
          upload_source: "dashboard",
          domain: "tanmay111-files.tixte.co",
          type: 1,
          name: details.name + image.name,
        })
      );
      formData.append("file", image);
      const imageUrl = URL.createObjectURL(image);
      setImageUrl(imageUrl);
      try {
        setLoader(true);
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            loc: "i",
          },
          body: formData,
        });
        const data: upload = await response.json();
        if (response.ok) {
          const res = await fetch("/api/update", {
            method: "PATCH",
            body: JSON.stringify({
              type: "profile-pic",
              data: {
                image: data.data.direct_url,
                del: data.data.deletion_url,
              },
            }),
          });
          if (!res.ok) {
            throw new Error((await res.json()).message);
          }
        }
        if (!response.ok) {
          throw new Error((await response.json()).message);
        }
      } catch (error) {
        showError(error);
      } finally {
        setLoader(false);
      }

      return () => URL.revokeObjectURL(imageUrl);
    } else if (e.target.files && e.target.files.length > 1) {
      toast.error("Caught you 😃");
    }
  };
  return (
    <AnimatePresence>
      <div className="max-w-28">
        <input
          key={"imageUpload"}
          onChange={uploadImage}
          type="file"
          hidden
          accept="image/*"
          name="image"
          id="image"
        />
        <label htmlFor="image" className="cursor-pointer">
          <motion.div
            key={"image"}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              stiffness: 45,
            }}
            exit={{ y: 0, opacity: 0 }}
            className="h-32 w-32 rounded-full overflow-hidden"
          >
            <Image
              key={"profile"}
              width={500}
              height={500}
              src={
                imageUrl ||
                replaceInstagramURL(details.image) ||
                "/notFound.jpg"
              }
              alt="profile"
              onError={(e) => (e.currentTarget.src = "/notFound.jpg")}
              className=" h-[100%] w-[100%] object-cover"
            />
          </motion.div>
        </label>
      </div>
      <motion.div
        key={"fullName"}
        suppressContentEditableWarning
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.7,
          stiffness: 45,
        }}
        exit={{ y: 0, opacity: 0 }}
        ref={fullNameRef}
        contentEditable
        translate="no"
        className="font-semibold outline-none text-3xl w-full py-0.5 pl-1.5 border-none -mt-2"
      >
        <p className="w-[75dvw] break-words">{details.fullName}</p>
      </motion.div>
      <motion.div
        suppressContentEditableWarning
        key={"bio"}
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.7,
          stiffness: 45,
        }}
        exit={{ y: 0, opacity: 0 }}
        ref={bioRef}
        contentEditable
        translate="no"
        className="dark:text-zinc-100/95 outline-none w-full border-none text-lg pl-1.5 -mt-4"
      >
        <div>
          {details.bio.length > 0
            ? details.bio.split("\n").map((line, index) => (
                <p className=" w-[75dvw] break-words" key={index}>
                  {line}
                </p>
              ))
            : "bio not set"}
        </div>
      </motion.div>
      <Links
        key={"links"}
        details={details}
        loggedIn={details ? true : false}
      />
      {user?.music && <Music key={"music"} user={details} />}
    </AnimatePresence>
  );
}

/**
 mongodb free-tier can't handle this
 *  
 */

// export const ProfileAnalytics = ({ user }: { user: IUser }) => {
//   const [data, setData] = useState<any[]>([
//     {
//       date: new Date().toISOString().split("T")[0],
//       views: 0,
//     },
//   ]);
//   const analytics = useCallback(() => {
//     const offset = 7 * 24 * 60 * 60 * 1000;
//     const date = new Date();
//     date.setTime(date.getTime() - offset);
//   }, []);

//   const formatDateTime = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       month: "short",
//       day: "numeric",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   const CustomTooltip: React.FC<TooltipProps<number, string>> = (props) => {
//     const { active, payload, label } = props;

//     if (active && payload && payload.length) {
//       return (
//         <div
//           className="custom-tooltip"
//           style={{
//             backgroundColor: "#000",
//             color: "#fff",
//             padding: "10px",
//             borderRadius: "5px",
//           }}
//         >
//           <p className="label">{`${formatDateTime(label)}`}</p>
//           <p className="intro">{`Views: ${payload[0].value}`}</p>
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderAnalytics = () => {
//     return (
//       <motion.div
//         initial={{ filter: "blur(10px)", opacity: 0 }}
//         animate={{ filter: "blur(0px)", opacity: 1 }}
//         transition={{ duration: 1 }}
//         style={{ width: "100%", height: "100%", marginBottom: ".7rem" }}
//       >
//         <ResponsiveContainer>
//           <BarChart
//             data={data}
//             className=" text-xs md:text-base text-black"
//             margin={{
//               top: 5,
//               right: 30,
//               left: 0,
//               bottom: 5,
//             }}
//           >
//             <XAxis dataKey="date" tickFormatter={formatDate} />
//             <YAxis />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar type="monotoneX" dataKey="views" fill="#ffffff" />
//           </BarChart>
//         </ResponsiveContainer>
//       </motion.div>
//     );
//   };
//   if (isDesktop) {
//     return (
//       <Dialog onOpenChange={analytics}>
//         <DialogTrigger className="h-[1.4rem] w-[1.4rem] ml-1 text-zinc-400 hover:text-zinc-200 mt-2">
//           <SiSimpleanalytics />
//         </DialogTrigger>
//         <DialogContent className="w-[100dvw] rounded-xl border-none ">
//           <DialogHeader>
//             <DialogTitle>Profile Analytics</DialogTitle>
//             <DialogDescription></DialogDescription>
//           </DialogHeader>
//           <div className="h-[87dvh] ">{renderAnalytics()}</div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer onOpenChange={analytics}>
//       <DrawerTrigger className="h-[1.4rem] w-[1.4rem] ml-1 text-zinc-400 hover:text-zinc-200 mt-2">
//         <SiSimpleanalytics />
//       </DrawerTrigger>
//       <DrawerContent className=" border-none">
//         <DrawerHeader>
//           <DrawerTitle>Profile Analytics</DrawerTitle>
//           <DrawerDescription></DrawerDescription>
//         </DrawerHeader>
//         <div style={{ width: "100%", height: 200 }}>{renderAnalytics()}</div>
//       </DrawerContent>
//     </Drawer>
//   );
// };
export default Details;
