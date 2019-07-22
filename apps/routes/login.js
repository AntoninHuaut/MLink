const router = require("express").Router();
const passport = require('passport');

router.get("/", passport.authenticate('discord.js'));
router.get("/callback", passport.authenticate('discord.js', {
    failureRedirect: '/'
}), function (req, res) {
    req.session.user = req.user;
    res.redirect('/');
});

module.exports = router;