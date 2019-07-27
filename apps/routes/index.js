const passport = require('passport');
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
exports.getLimiter = (windowMs, max, code, message) => {
    return rateLimit({
        windowMs: windowMs,
        max: max,
        message: {
            code: code,
            message: message
        }
    });
}
const baseLimiter = this.getLimiter(60 * 1000, 100, 429, "Trop grands nombres de requêtes, veuillez réessayer plus tard."); // 1 minute
const apiLimiter = this.getLimiter(10 * 60 * 1000, 100, 429, "Trop grands nombres de requêtes, veuillez réessayer plus tard."); // 10 minutes

router.use(express.static('apps/static'));
router.use("/", baseLimiter, require("./base"));
router.use("/api", apiLimiter, require("./api"));
router.use("/login", baseLimiter, require("./login"));

router.use("/game", baseLimiter, passport.authenticate('discord'), require("./game"));
router.use("/link", baseLimiter, passport.authenticate('discord'), require("./link"));
router.use("/logout", baseLimiter, passport.authenticate('discord'), (req, res) => req.session.destroy((err) => res.redirect('/')));

module.exports = router;