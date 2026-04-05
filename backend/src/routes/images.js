import express, { response } from 'express';
import {uploadImage, getImage} from '../controllers/imageController.js'
import multer from "multer";

const API_URL = 'http://localhost:3000/api';
const imageRouter = express.Router();
// const upload = multer({ dest: "uploads/" });

imageRouter.post('/upload', (req, res, next) => {
//   upload.single("image"),

    uploadImage(req, res).catch(next);
});
imageRouter.get('/', (req, res, next) => {

    getImage(req, res).catch(next);
});


export default imageRouter;
