import express from 'express';
import { register, login } from '../controllers/authController.js'
import {protect} from '../middleware/auth.js'


const authRouter = express.Router();

const API_URL = 'http://localhost:3000/api';

authRouter.post('/register', (req, res, next) => {
    // const name = req.username
    // const email = req.email
    // const password = req.password

    const result = register(req, res)
    // register(req, res).catch(next);
    console.log(result)
});
// authRouter.post('/login', (req, res, next) => {
//     login(req, res).catch(next);
// });

// // Protected example route
// authRouter.get('/me', protect, (req, res)=> {
//     res.json({ msg: 'You are authorized', user: req.user });
// });

export default authRouter;
