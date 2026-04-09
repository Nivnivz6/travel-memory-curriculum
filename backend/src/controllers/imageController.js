import express from "express";
import Image from "../models/image.js";

import { signToken } from "../utils/jwt.js";

import minio from "../config/minio.js";

const uploadImage = async (req, res) => {
  console.log("hello");

  const imageName = `image/${req.user}/${Date.now()}/${req.file.originalname}`;
const imagePath =  req.file.path
  const ans = minio.fPutObject("images", imageName, imagePath, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File uploaded successfully.`);
  });

  const image = new Image({ userID: req.user, name: imageName, url: imagePath });
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
  const ID = req.user
  let images = await Image.find({ userID: ID });
  console.log(images)
  const urls = await Promise.all(
    images.map((img) => minio.presignedGetObject("images",img.name)),
      // images.map((img) => minio.fGetObject("images", img.name )),
      // images.map((img) =>  minio.presignedUrl("GET","images",  "img.name",  6000 )),


  );
  // res.send({ images: urls });
  return res.json(urls)
};
export { getImage, uploadImage };
