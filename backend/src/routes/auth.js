const express = require("express");


const router = express.Router();


router.post('/register', (req, res, next) => {
    register(req, res).catch(next);
});
router.post('/login', (req, res, next) => {
    login(req, res).catch(next);
});

// Protected example route
router.get('/me', protect, (req, res)=> {
    res.json({ msg: 'You are authorized', user: req.user });
});

export default router;
