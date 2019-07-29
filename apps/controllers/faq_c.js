module.exports = async function (req, res) {
    res.render('faq', {
        user: req.session.user
    });
}