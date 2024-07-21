import mongoose, { Document } from "mongoose";

export interface metadata {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface gallery {
  _id: mongoose.Types.ObjectId;
  type: "image" | "video";
  userId: mongoose.Types.ObjectId;
  data: string;
  del: string;
  link: string | null;
  clicks: number;
  features: string[];
}
export interface starred extends Document {
  userId: mongoose.Types.ObjectId;
  starredId: mongoose.Types.ObjectId;
}

export interface match {
  per: string;
  image: string;
}

export interface discover {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  bio: string;
  image: string;
  username: string;
}

export interface roomCard {
  index: number;
  id: string;
  name: string;
  ownerId: string;
  speakers: string[];
  listeners: string[];
  location: string;
  total: number;
}

export interface upload {
  data: { deletion_url: string; direct_url: string };
  features: string[];
}

export interface Artist {
  id?: string;
  name?: string;
}

export interface music {
  start: number;
  end: number;
  youtubeId: string;
  audio: string;
  title: string;
  artists: Artist[];
  thumbnailUrl: string;
}
