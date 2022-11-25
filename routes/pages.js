const express = require('express');
const { route } = require('./auth');
const router = express.Router();


router.get("/", (req,res)=>{
    res.render('login');
});
router.get("/login", (req,res)=>{
    res.render('login');
});
router.get("/register", (req,res)=>{
    res.render('register');
});
router.get("/home", (req,res)=>{
    res.render('home');
});
router.get('/logout', function(request, response, next){
    request.session.destroy((err)=>{
        if(err) throw err;
        console.log("Session destroyed!");
    });
    response.render("login", {msg:"Logged out successfully", msg_type:"good"});
});

module.exports = router;