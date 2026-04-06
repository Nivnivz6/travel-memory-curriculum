import express from "express";
import Image from "../models/image.js";

import { signToken } from "../utils/jwt.js";

import minio from "../config/minio.js";



const uploadImage = async (req, res) => {
  console.log("hello");

  minio.fPutObject('images', req.file.originalname, req.file.path, (err, etag) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File uploaded successfully. ETag: ${etag}`);
  });

};

const getImage = async (req, res) => {
  console.log("hi");
};
export { getImage, uploadImage };
