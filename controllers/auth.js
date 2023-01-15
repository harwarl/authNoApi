const bcrypt = require('bcrypt');
const User = require('../models/user');
exports.getLogin = (req, res, next) =>{
    res.render('auth/login', {
        pageTitle: 'Login',
    })
}

exports.postLogin = (req, res, next) =>{
    const { email, password } = req.body;
    User.findOne({email: email})
    .then(user=>{
        if(!user) return res.status(400).json({message: "Email not registered, signup instead"});
        bcrypt.compare(password, user.password)
        .then(result =>{
            if(!result) return res.status(400).json({message: "Incorrect Password"});
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err)=>{
                if(err) return res.status(400).json({message: err});
                return res.status(200).json({message: req.session});
            })
        })
    })
    .catch(err=>console.log(err));
    
}
exports.getSignUp = (req, res, next) =>{
    res.render('auth/signup', {
       pageTitle: "signUp" 
    })
}

exports.postSignUp = (req, res, next) =>{
    const {email, password, confirmpassword } = req.body;
    User.findOne({email: email})
    .then(user =>{
        if(user) return res.status(400).json({message: "Email already exists, login instead"});
        if(password !== confirmpassword) {
            return res.redirect('/signup');
            // return res.status(400).json({message: "password do not match"});
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
    res.session.destroy(err=>{
        console.log(err);
        //redirect to page
    })
}