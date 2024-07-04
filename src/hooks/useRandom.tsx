"use client";

import { useCallback, useEffect, useState } from "react";

function useRandom() {
  const [code, setCode] = useState<string>();
  const getRandomCode = useCallback(() => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    setCode(
      chars
        .slice(0, 4)
        .split("")
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("")
    );
  }, []);

  useEffect(() => {
    getRandomCode();
  }, [getRandomCode]);

  return { code, getRandomCode };
}

export default useRandom;
