exports.base = async function (req, res) {
    res.render('home', {
        user: req.session.user
    });
}