"use client";
import React from "react";
import { user } from "../types/types";
import { useUserContext } from "@/store/context";

import Masonry from "@/components/ui/Masonry";
function Gallery({ user, remove }: { user: user; remove?: boolean }) {
  const { gallery } = useUserContext();

  if (gallery) {
    return <Masonry remove={remove} data={gallery} />;
  }
  return <Masonry remove={remove} data={user.usersDoc.gallery} />;
}

export default Gallery;
