import { metadata } from "@/app/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const isValidURL = (value: string) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  return urlRegex.test(value);
};

export const getMetadata = async (link: string) => {
  if (isValidURL(link)) {
    try {
      const data = await fetch(`/api/metadata?url=${link}`, {
        cache: "force-cache",
      });
      if (data.ok) {
        const response = await data.json();
        return response as metadata;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export function replaceInstagramURL(originalURL: string) {
  if (typeof originalURL == "undefined")
    return "https://1nlink.vercel.app/notFound.jpg";
  if (!originalURL.startsWith("https://instagram")) return originalURL;
  const regex = /https:\/\/instagram\.[^/]+/;
  const newBaseURL = "https://instagram.fmdc3-1.fna.fbcdn.net";
  return (
    "https://image-proxy-1a78.onrender.com/?url=" +
    originalURL.replace(regex, newBaseURL).replace(".jpg?", ".jpg&")
  );
}

export const chunk = <T>(array: T[], size: number = 2): T[][] => {
  if (!Array.isArray(array) || !array.length) return [];
  const result = [];
  let index = 0;

  while (index < array.length) {
    result.push(array.slice(index, (index += size)));
  }

  return result;
};

export function formatNumber(text: string | number) {
  const num = Number(text);
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

export function getRandom() {
  const chars = "0123456789";
  return chars
    .slice(0, 6)
    .split("")
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}
