/**
 * apply when paid
 */
import mongoose, { Schema } from "mongoose";

interface analytics {
  type: "profile" | "gallery";
  userId: mongoose.Types.ObjectId;
  location: string;
}

const analyticsSchema: Schema<analytics> = new Schema(
  {
    type: {
      type: String,
      enum: ["profile", "gallery"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

export default Analytics;
