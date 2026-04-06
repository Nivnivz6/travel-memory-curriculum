import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("Image", imageSchema);

export default Image;