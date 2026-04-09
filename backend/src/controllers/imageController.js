import express from "express";
import Image from "../models/image.js";

import { signToken } from "../utils/jwt.js";

import minio from "../config/minio.js";

const uploadImage = async (req, res) => {
  console.log("hello");

  const imgS3Name = `image/${req.user}/${Date.now()}/${req.file.originalname}`;
  console.log(req.file);
  const imagePath = req.file.buffer;

  minio.putObject("images", imgS3Name, imagePath, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File uploaded successfully.`);
  });
  const s3 = await minio.presignedGetObject("images", imgS3Name);
  const image = new Image({
    userID: req.user,
    s3Name: imgS3Name,
    s3Url: s3,
    filename: req.file.originalname,
    size: req.file.size,
  });
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
  const ID = req.user;
  let images = await Image.find({ userID: ID });

  await Promise.all(
    images.map(async (img) => {
      img.s3Url = await minio.presignedGetObject("images", img.s3Name);
    }),
  );
  //filters:

  const filter = Object.keys(req.query)[0];
  const sort = Object.values(req.query)[0];
  console.log(new Date(sort));

  if (filter === "name") {
    images = images.filter((item) => item.filename === sort);
  } else if (filter === "status") {
    images = images.filter((item) => item.status === sort);
  } else if (filter === "minSize") {
    images = images.filter((item) => item.size >= Number(sort));
  } else if (filter === "maxSize") {
    images = images.filter((item) => item.size <= Number(sort));
  } else if (filter === "fromDate") {
    console.log("in")
    images = images.filter((item) => item.uploadDate >= new Date(sort));
  }
  return res.json(images);
};

export { getImage, uploadImage };
