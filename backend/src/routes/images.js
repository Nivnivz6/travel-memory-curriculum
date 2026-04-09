import express, { response } from 'express';
import {uploadImage, getImage} from '../controllers/imageController.js'
import multer from 'multer'
import {protect} from '../middleware/auth.js' 

// const upload = multer({ dest: 'uploads/' });
const storage = multer.memoryStorage();

const upload = multer({ storage })

const API_URL = 'http://localhost:3000/api';
const imageRouter = express.Router();

imageRouter.post('/upload', protect, upload.single("image"),
 (req, res, next) => {
  
    uploadImage(req, res).catch(next);
});
imageRouter.get('', protect, (req, res, next) => {

    getImage(req, res).catch(next);
});


export default imageRouter;
