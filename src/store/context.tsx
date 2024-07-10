"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { gallery, metadata, user } from "@/app/types/types";
const queryClient = new QueryClient();

interface useUserContextType {
  user: user | null;
  setUser: React.Dispatch<React.SetStateAction<user | null>>;
  links: metadata[] | null;
  setLinks: React.Dispatch<React.SetStateAction<metadata[] | null>>;
  match: boolean;
  setMatch: React.Dispatch<React.SetStateAction<boolean>>;
  gallery: gallery[] | null;
  setGallery: React.Dispatch<React.SetStateAction<gallery[] | null>>;
  loader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  country: string | null;
}

const userContext = createContext<useUserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<user | null>(null);
  const [links, setLinks] = useState<metadata[] | null>(null);
  const [gallery, setGallery] = useState<gallery[] | null>(null);
  const [match, setMatch] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.ipify.org/", {
      cache: "force-cache",
    })
      .then(async (response) => {
        const ip = await response.text();
        try {
          const res = await fetch(`/api/location/${ip}`);
          const country = (await res.json()).country;
          setCountry(country);
        } catch (error) {
          setCountry("unknown");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <userContext.Provider
        value={{
          user,
          setUser,
          links,
          setLinks,
          match,
          setMatch,
          setGallery,
          gallery,
          loader,
          setLoader,
          country,
        }}
      >
        {children}
      </userContext.Provider>
    </QueryClientProvider>
  );
};

const useUserContext = (): useUserContextType => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error("userContext must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
