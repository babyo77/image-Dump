import { SearchSong } from "napster-info/dist/types";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { Models } from "node-appwrite";

export interface instagramUser {
  username: string;
  profile_pic_url: string;
  hd_profile_pic_url_info: { url: string };
  bio_links: { url: string }[];
  biography: string;
  pk_id: string;
  full_name: string;
  category: string;
}

export interface metadata {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface gallery extends Models.Document {
  type: "image" | "video";
  index: number;
  for: string;
  tags: string[];
  data: string;
  del: string;
  link: string | null;
  clicks: number;
  features: string[];
}
export interface starred extends Models.Document {
  username: string;
  userID: string;
}
export interface music extends SearchSong {
  start: number;
  end: number;
}
export interface userDoc extends Models.Document {
  links: string[];
  bio: string;
  fullName: string;
  interests: string[];
  galleryTotal: number;
  starred: starred[];
  gallery: gallery[];
  music: music | null;
  views: number;
}

export interface match {
  per: string;
  image: string;
}
export interface user extends Models.User<Models.Preferences> {
  cookie: RequestCookie | undefined;
  links: metadata[];
  usersDoc: userDoc;
  match?: match;
  loggedInUser?: user | null;
  isStarred?: boolean;
}

export interface discover {
  fullName: string;
  bio: string;
  $id: string;
  image: string;
  username: string;
}
