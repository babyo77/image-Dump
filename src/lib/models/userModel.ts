import { gallery, metadata, music } from "@/app/types/types";
import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  fullName: string;
  links: metadata[];
  interests: string[];
  music: music;
  bio: string;
  phoneNumber: number | null;
  image: string;
  email: string;
  del: string;
  gallery?: gallery[];
  loggedInUser?: IUser;
  isStarred?: boolean;
  match?: { per: string };
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      maxlength: [50, "Name cannot be more than 50 characters."],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      maxlength: [40, "Full name cannot be more than 40 characters."],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required."],
      trim: true,
    },
    del: {
      type: String,
      required: [true, "Del field is required."],
      trim: true,
    },
    links: {
      type: [String],
      default: [],
      validate: {
        validator: (val: string[]) => val.length <= 70,
        message: "Cannot have than 7 links.",
      },
    },
    interests: {
      type: [String],
      validate: {
        validator: (val: string[]) => val.length <= 70,
        message: "Cannot have more than 70 interests.",
      },
      default: [],
    },
    music: {
      type: [String],
      maxlength: [10, "Music cannot be more than 50 characters."],
    },
    bio: {
      type: String,
      maxlength: [100, "Bio cannot be more than 100 characters."],
      default: "",
    },
    phoneNumber: {
      type: Number,
      validate: {
        validator: (val: number | null) =>
          val === null || Number.isInteger(val),
        message: "Phone number must be an integer.",
      },
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.path("links").set(function (val: string[]) {
  return val.filter((value, index, self) => self.indexOf(value) === index);
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
