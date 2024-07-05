"use client";

import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const handleClick = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: "M0 10 L5 0 L10 10z",
    });
    const square = confetti.shapeFromPath({
      path: "M0 0 L10 0 L10 10 L0 10 Z",
    });
    const coin = confetti.shapeFromPath({
      path: "M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z",
    });
    const tree = confetti.shapeFromPath({
      path: "M5 0 L10 10 L0 10 Z",
    });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value, direction]);

  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleSpringUpdate = (latest: any) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          latest.toFixed(0)
        );
        if (statusRef.current) {
          if (latest === value) {
            if (value >= 70) {
              handleClick();
              statusRef.current.style.color = "white";
              ref.current.style.color = "white";
            } else {
              statusRef.current.style.color = "red";
              ref.current.style.color = "red";
            }
          }
        }
      }
    };

    springValue.on("change", handleSpringUpdate);

    return () => {
      springValue.clearListeners();
    };
  }, [springValue, value, direction]);
  return (
    <div
      ref={statusRef}
      className="transition-all duration-500 whitespace-pre-wrap text-4xl font-medium tracking-tighter"
    >
      <span className={cn("inline-block tabular-nums", className)} ref={ref} />{" "}
      % Match
    </div>
  );
}
