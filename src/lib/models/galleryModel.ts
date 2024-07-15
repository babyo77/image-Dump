import { gallery } from "@/app/types/types";
import mongoose, { Schema } from "mongoose";

const gallerySchema: Schema<gallery> = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    del: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model<gallery>("Gallery", gallerySchema);

export default Gallery;
