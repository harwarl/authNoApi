const authroute = require('../routes/auth');
module.exports = (app)=>{
    app.use(authroute);
}