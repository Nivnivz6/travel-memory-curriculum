import express from "express";
import Image from "../models/image.js";

import { signToken } from "../utils/jwt.js";

import minio from "../config/minio.js";

const uploadImage = async (req, res) => {
  console.log("hello");

  const imgS3Name = `image/${req.user}/${Date.now()}/${req.file.originalname}`;
const imagePath =  req.file.path
  const ans = minio.fPutObject("images", imgS3Name, imagePath, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File uploaded successfully.`);
  });

  const image = new Image({ userID: req.user, s3Name: imgS3Name, filename: req.file.originalname });
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
  // console.log(images)
  // const urls = await Promise.all(
    // images.map((img) => img.url = minio.presignedGetObject("images",img.name)),
        // images.map((img) => updateUrlsImages(img)),
await Promise.all(images.map(async (img) => {
  img.s3Url = await minio.presignedGetObject("images", img.s3Name);
}));
      // images.map((img) => minio.fGetObject("images", img.name )),
      // images.map((img) =>  minio.presignedUrl("GET","images",  "img.name",  6000 )),
  // );
  // images[0].url = urls[0]
  // res.send({ images: urls });
  console.log( images)
  return res.json(images)
};
export { getImage, uploadImage };
