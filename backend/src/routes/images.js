import express, { response } from 'express';
import {uploadImage, getImage} from '../controllers/imageController.js'
import multer from 'multer'
const upload = multer({ dest: 'uploads/' });

const API_URL = 'http://localhost:3000/api';
const imageRouter = express.Router();

imageRouter.post('/upload',upload.single("image"),
 (req, res, next) => {
  
    uploadImage(req, res).catch(next);
});
imageRouter.get('/', (req, res, next) => {

    getImage(req, res).catch(next);
});


export default imageRouter;
