exports.getIndex = (req, res, next) =>{
    res.render('pages/index', {
        pageTitle: "Index Page",
    })
}