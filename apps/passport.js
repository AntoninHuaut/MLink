const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const _strategy = require('passport-discord.js').Strategy;
const config = require("./config.json");

passport.serializeUser((u, d) => d(null, u));
passport.deserializeUser((u, d) => d(null, u));

const DiscordStrategy = new _strategy({
    clientID: config.oauth2.clientID,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: process.env.CALLBACK_URL,
    scope: config.oauth2.scope
}, function (accesstoken, refreshToken, profile, done) {
    profile.accesstoken = accesstoken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
});

passport.use('discord', DiscordStrategy);
refresh.use('discord', DiscordStrategy);