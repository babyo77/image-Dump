"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLProps } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/client/firebase";
import { toast } from "sonner";
import Link from "next/link";
export interface verificationInfo {
  id: string;
  bio: string;
}
interface BackgroundGridProps {
  color: string;
  cellSize: string | number;
  strokeWidth: number | string;
  className?: string;
  fade?: boolean;
}

function Login() {
  const [checking, setChecking] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Continue with Google");
  const [login, setLogin] = useState<boolean>(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecking(true);
    setStatus("Authenticating...");
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          setStatus("Logging in...");
          const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(user),
          });
          if (res.status === 200) {
            setLogin(true);
            router.push("/p");
          } else {
            toast.error((await res.json()).error.message);
          }
        }
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setStatus("Continue with Google");
        setChecking(false);
      });
  };

  return (
    <AnimatePresence>
      {!login && (
        <>
          <BackgroundGrid />
          <AnimatePresence>
            <motion.form
              key={"loginForm"}
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ filter: "blur(10px)", opacity: 0 }}
              onSubmit={handleVerify}
              className="absolute z-10 inset-0 flex flex-col gap-4 items-center justify-center text-white font-medium px-5 text-xs"
            >
              <h1 className="md:max-w-[40dvw] text-3xl">
                Login to your Account
              </h1>

              <Button
                disabled={checking}
                size={"sm"}
                className="w-full lg:max-w-[25dvw] py-7 rounded-xl md:max-w-[40dvw]"
              >
                {checking ? (
                  <div className=" flex items-center gap-x-0.5 text-lg font-medium">
                    <Loader className=" animate-spin h-6 w-6 font-semibold" />
                    <p>{status}</p>
                  </div>
                ) : (
                  <div className=" flex items-center gap-x-0.5 text-lg font-medium">
                    <AiOutlineGoogle className="h-6 w-6" />
                    <p>{status}</p>
                  </div>
                )}
              </Button>
              <Link href={"/discover"} className="-my-2">
                <span className=" underline underline-offset-4 hover:text-neutral-200 text-neutral-400">
                  Discover
                </span>
              </Link>
            </motion.form>
            <motion.footer
              key={"footer"}
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ filter: "blur(10px)", opacity: 0 }}
              className=" z-20 fixed bottom-2 text-center w-full text-xs text-zinc-400"
            >
              <a target="_blank" href="https://tanmayo7.vercel.app">
                Made by @babyo7_
              </a>
            </motion.footer>
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

const BackgroundGrid = ({
  color = "#2d2c2c",
  cellSize = "25px",
  strokeWidth = "3px",
  className,
  fade = true,
  ...props
}: Partial<BackgroundGridProps> & HTMLProps<HTMLDivElement>) => {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' stroke='${color}' stroke-width='${strokeWidth}' fill-opacity='0.4' >
      <path d='M 100 0 L 100 200'/>
      <path d='M 0 100 L 200 100'/>
    </svg>
  `;
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return (
    //@ts-expect-error:error
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`pointer-events-none absolute inset-0 left-0 top-0 flex h-full w-full ${className}`}
      style={{
        backgroundImage: `url("${svgDataUrl}")`,
        backgroundRepeat: "repeat",
        backgroundSize: cellSize,
        maskImage: fade
          ? `radial-gradient(ellipse at top, white, transparent 85%)`
          : undefined,
        WebkitMaskImage: fade
          ? `radial-gradient(ellipse at top, white, transparent 85%)`
          : undefined,
      }}
      {...props}
    ></motion.div>
  );
};

export default Login;
