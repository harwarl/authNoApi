const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGO_URI = "mongodb://127.0.0.1:27017/authS";
const authroute = require('./routes/auth');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(authroute);

mongoose.connect(MONGO_URI)
.then((result)=>{
    app.listen(3000);
})
.catch(err=>console.log(err));