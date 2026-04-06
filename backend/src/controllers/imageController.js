import express from "express";
import Image from "../models/image.js";

import { signToken } from "../utils/jwt.js";

import minio from "../config/minio.js";

const uploadImage = async (req, res) => {
  console.log("hello");

  const imageName = `image/${req.user}/${Date.now()}/${req.file.originalname}`;

  minio.fPutObject("images", imageName, req.file.path, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File uploaded successfully.`);
  });
  const image = new Image({ userID: req.user, image: imageName });
  console.log(image);
  try {
    await image.save();
    return res.status(201).json({ msg: "saved image successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err });
  }
};

const getImage = async (req, res) => {
  console.log("hijnjjnjn");
  let images = await Image.find({ userID: req.user });
  const urls = await Promise.all(
    images.map((img) => minio.presignedGetObject("images", img.image)),
  );
  res.json({ images: urls });
};
export { getImage, uploadImage };
