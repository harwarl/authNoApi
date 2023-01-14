const bcrypt = require('bcrypt');
const User = require('../models/user');
// exports.getLogin = (req, res, next) =>{
//     res.render('auth/login', {

//     })
// }
// exports.postLogin = (req, res, next) =>{
    
// }
// exports.getSignUp = (req, res, next) =>{
//     res.render('auth/signup', {
        
//     })
// }
exports.postSignUp = (req, res, next) =>{
    const {email, password, confirmpassword } = req.body;
    if(password !== confirmpassword) {
        // return res.redirect('/signup');
        return res.status(400).json({message: "password do not match"});
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
        res.status(200).json({message: user});
    })
    .catch(err=>console.log(err));
}