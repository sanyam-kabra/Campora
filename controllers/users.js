const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.register = async(req, res) => {
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
}

module.exports.renderLogin = async(req, res) => {
    res.render('user/login');
}

module.exports.login = (req, res)=> {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back!');
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}