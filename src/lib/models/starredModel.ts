import { starred } from "@/app/types/types";
import mongoose, { Schema } from "mongoose";

const starredModel: Schema<starred> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    starredId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Starred =
  mongoose.models.Starred || mongoose.model("Starred", starredModel);

export default Starred;
