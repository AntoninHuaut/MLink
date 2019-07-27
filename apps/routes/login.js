const router = require("express").Router();
const passport = require('passport');

router.get("/", passport.authenticate('discord'));
router.get("/callback", passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    req.session.user = req.user;
    res.redirect('/');
}, function (err, req, res, next) {
    if (err)
        res.render('home', {
            message: "Code incorrect, veuillez réessayer",
            user: req.session.user
        });
});

module.exports = router;