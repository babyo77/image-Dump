"use client";
import React from "react";
import { useUserContext } from "@/store/context";

import Masonry from "@/components/ui/Masonry";
import { IUser } from "@/lib/models/userModel";
function Gallery({ user, remove = false }: { user: IUser; remove?: boolean }) {
  const { gallery } = useUserContext();

  if (gallery) {
    return <Masonry remove={remove} data={gallery} />;
  }
  return <Masonry remove={remove} data={user?.gallery || []} />;
}

export default Gallery;
