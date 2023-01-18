const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/user');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILPASS
  }
})

exports.getLogin = (req, res, next) =>{
    res.render('auth/login', {
        pageTitle: 'Login',
        error: req.flash('error')
    })
}

exports.postLogin = (req, res, next) =>{
    const { email, password } = req.body;
    User.findOne({email: email})
    .then(user=>{
        if(!user) 
        {
            req.flash('error', 'Email not registered, signUp instead');
            return res.redirect('/login');
            // return res.status(400).json({message: "Email not registered, signup instead"});
        }
        bcrypt.compare(password, user.password)
        .then(result =>{
            if(!result) {
                // return res.status(400).json({message: "Incorrect Password"});
                req.flash('error', 'Incorrect password');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err)=>{
                if(err) console.log(err)
                res.redirect('/');
            })
        })
    })   
    .catch(err=>console.log(err));
}

exports.getSignUp = (req, res, next) =>{
    res.render('auth/signup', {
       pageTitle: "signUp",
       error: req.flash('error')
    })
}

exports.postSignUp = (req, res, next) =>{
    const {email, password, confirmpassword } = req.body;
    User.findOne({email: email})
    .then(user =>{
        if(user) {
            req.flash('error', 'Mail already Exists');
            // return res.status(400).json({message: "Email already exists, login instead"});
            return res.redirect('/signup');
        }
        if(password !== confirmpassword) {
            req.flash('error', 'Password Do Not Match');
            return res.redirect('/signup');
        }
        bcrypt.hash(password, 10)
        .then(hashedPassword =>{
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();    
        })
        .then(user=>{
            res.redirect('/login');
            // res.status(200).json({message: user});
        })
    })
    .catch(err=>console.log(err));
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/login');
    })
}

exports.getReset = (req, res, next) =>{
    res.render('auth/reset', {
        pageTitle: "Reset Password",
        error: req.flash('error')
    })
};

exports.postReset = (req, res, next) =>{
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer)=>{
        if(err) console.log(err);
        const token = buffer.toString('hex');
        User.findOne({email: email})
        .then(user=>{
            if(!user){
            req.flash('error', 'Email not Registered');
            return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 1800000;
            return user.save()
            .then(result =>{
                res.redirect('/');
                transport.sendMail({
                    from: process.env.GMAILUSER,
                    to: email,
                    subject: "Password Reset",
                    html: `<p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>`
                })
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    }) 
}

exports.getNewPassword = (req, res, next) =>{
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user=>{
        if(!user){
            req.flash('error', 'Token Expired');
            return res.redirect('/reset');
        }
        res.render('auth/newPassword', {
            pageTitle: 'New password',
            error: req.flash('error'),
            userId: user._id, 
            token: token
        })
    })
}

exports.postNewPassword = (req, res, next) =>{
    const { userId, password, token } = req.body;
    User.findOne({_id: userId, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user =>{
        if(!user){
            req.flash('error', 'Token expired');
            return res.redirect('/reset');
        }
        bcrypt.hash(password, 10)
        .then(hashedPassword=>{
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save().then(result=>{
                return res.redirect('/login');
            })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
}