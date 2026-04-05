import express, { response } from 'express';
import {uploadImage} from '../controllers/imageController.js'

const API_URL = 'http://localhost:3000/api';
const imageRouter = express.Router();

imageRouter.post('/upload', (req, res, next) => {
    console.log("ggifgf")

    uploadImage(req, res).catch(next);
});



export default imageRouter;
