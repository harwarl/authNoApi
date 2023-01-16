const authroute = require('../routes/auth');
const pageroute = require('../routes/page');
module.exports = (app)=>{
    app.use(authroute);
    app.use(pageroute);
}