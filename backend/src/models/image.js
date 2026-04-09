import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    s3Name: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    s3Url: {
      type: String,
      required: true,
      default: "",
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed"],
      default: "pending",
    },
    uploadDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
