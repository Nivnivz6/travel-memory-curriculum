import express, { response } from 'express';
import { register, login } from '../controllers/authController.js'
import {protect} from '../middleware/auth.js'


const authRouter = express.Router();

const API_URL = 'http://localhost:3000/api';

authRouter.post('/register', (req, res, next) => {
  

    register(req, res).catch(next);
});

authRouter.post('/login', (req, res, next) => {
    login(req, res).catch(next);
});



export default authRouter;
