const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const passport = require('passport');
const {storeReturnTo} = require('../middlewares'); 

router.get('/register', async(req, res) => {
    res.render('user/register');
})

router.post('/register', catchAsync(async(req, res) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email , username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err){
            return next(err);
        }
        req.flash('success', 'Welcome to Campora!');
        res.redirect('/campgrounds');
    })
    }
    catch(e){
        if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
            req.flash('error', 'Email is already in use.');
        } else {
            req.flash('error', e.message);
        }
        res.redirect('register');
    }
}))

router.get('/login', async(req, res) => {
    res.render('user/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), async(req, res)=> {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back!');
    res.redirect(redirectUrl);
})

//Logout 
router.get('/logout' , (req,res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;