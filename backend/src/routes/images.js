import express, { response } from 'express';
import {uploadImage, getImage} from '../controllers/imageController.js'
import multer from 'multer'
import {protect} from '../middleware/auth.js' 
const upload = multer({ dest: 'uploads/' });

const API_URL = 'http://localhost:3000/api';
const imageRouter = express.Router();

imageRouter.post('/upload',upload.single("image"), protect,
 (req, res, next) => {
  
    uploadImage(req, res).catch(next);
});
imageRouter.get('', protect, (req, res, next) => {
    console.log("jjj")

    getImage(req, res).catch(next);
    console.log("k")
});


export default imageRouter;
