const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const MONGO_URI = "mongodb://127.0.0.1:27017/authS";
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const authroute = require('./routes/auth');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
    collection: 'sessions',
    uri: MONGO_URI
});

app.use(session({
    secret: 'my secret cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true},
    store: store
}));

app.use((req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    User.findOne({_id: req.session.user._id})
    .then(user=>{
        req.user  = user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use(authroute);

mongoose.connect(MONGO_URI)
.then((result)=>{
    app.listen(3000);
})
.catch(err=>console.log(err));