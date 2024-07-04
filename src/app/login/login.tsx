"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRandom from "@/hooks/useRandom";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
export interface verificationInfo {
  id: string;
  bio: string;
}

function Login() {
  const [username, setUsername] = useState<string>("");
  const { code: verificationCode } = useRandom();
  const [checking, setChecking] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    toast.dismiss();
  }, []);
  const handleCopy = async () => {
    try {
      if (verificationCode) {
        await navigator.clipboard.writeText(verificationCode);
        toast.message("Code copied to clipboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length == 0) {
      return toast.error("Username is required");
    }

    setChecking(true);
    toast.loading("Verifying...", {
      id: "verify",
    });
    try {
      const response = await fetch(`/api/verify/${username}`, {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
        cache: "no-cache",
      });
      if (response.ok) {
        toast.dismiss("verify");
        router.push(`/profile`);
        return;
      }
      const message = await response.json();
      toast.dismiss("verify");
      toast.error(message.error);
    } catch (error) {
      toast.dismiss("verify");
      //@ts-expect-error:error message
      toast.error(error.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <BackgroundGrid />
      <motion.form
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onSubmit={handleVerify}
        className="absolute z-10 inset-0 flex flex-col gap-4 items-center justify-center text-white font-medium px-5 text-xs"
      >
        <h1 className="md:max-w-[40dvw] text-2xl">Login</h1>
        <Input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          className="md:max-w-[40dvw] lg:max-w-[30dvw] py-[1.3rem] leading-tight tracking-tight"
          placeholder="Instagram username"
          required
        />
        <Button
          disabled={checking}
          size={"sm"}
          className="w-full lg:max-w-[30dvw] py-[1.2rem] md:max-w-[40dvw]"
        >
          {checking ? <Loader className=" animate-spin h-5 w-5" /> : "Login"}
        </Button>
        {verificationCode && username.length > 2 && (
          <motion.p
            onClick={handleCopy}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-base text-zinc-500 cursor-pointer lg:max-w-[30dvw] leading-tight tracking-tight md:max-w-[40dvw]"
          >
            Please add <span className="text-white">{verificationCode}</span> to
            your Instagram bio for account verification. You can remove it once
            the verification is complete.
          </motion.p>
        )}
      </motion.form>
      <motion.footer
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=" z-20 fixed bottom-2 text-center w-full text-xs text-zinc-400"
      >
        <a target="blank" href="https://tanmayo7.vercel.app">
          Made by @babyo7_
        </a>
      </motion.footer>
    </>
  );
}
import { HTMLProps } from "react";

interface BackgroundGridProps {
  color: string;
  cellSize: string | number;
  strokeWidth: number | string;
  className?: string;
  fade?: boolean;
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
      transition={{ duration: 0.5, delay: 1 }}
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
