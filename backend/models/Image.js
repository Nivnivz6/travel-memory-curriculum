import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageName: {
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

module.exports = { Image };
