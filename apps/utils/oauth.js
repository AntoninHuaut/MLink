const oauth2 = require('../config.json').oauth2;
const fetch = require('node-fetch');

exports.auth = (req, res) => {
    const redirectURL = encodeURIComponent(process.env.CALLBACK_URL);
    const scope = encodeURIComponent(oauth2.scope.join(' '));
    const clientID = encodeURIComponent(oauth2.clientID);
    res.redirect(`https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=${redirectURL}&scope=${scope}&client_id=${clientID}`);
}

exports.token = (req, res) => {
    if (!req.query.code)
        return res.redirect('/login');

    const details = {
        client_id: oauth2.clientID,
        client_secret: oauth2.clientSecret,
        grant_type: 'authorization_code',
        scope: oauth2.scope.join(' '),
        redirect_uri: process.env.CALLBACK_URL,
        code: req.query.code
    };

    refreshData(details, res, req);
}

exports.refresh = (req, res) => {
    if (!req.session.user.oauth2.refresh_token)
        return res.render('home', {
            user: req.session.user,
            message: "Impossible de rafraichir votre session"
        });

    const details = {
        client_id: oauth2.clientID,
        client_secret: oauth2.clientSecret,
        grant_type: 'refresh_token',
        scope: oauth2.scope.join(' '),
        redirect_uri: process.env.CALLBACK_URL,
        refresh_token: req.session.user.oauth2.refresh_token
    };

    refreshData(details, res, req);
}

async function refreshData(details, res, req) {
    const formBody = Object.entries(details).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');

    oauth2RQ('https://discordapp.com/api/oauth2/token', 'POST', formBody).then(async json => {
        let tmpErr;

        let userInfos = await oauth2RQ('https://discordapp.com/api/users/@me', 'GET', json.access_token).catch(err => tmpErr = true);
        let guildsInfos = await oauth2RQ('https://discordapp.com/api/users/@me/guilds', 'GET', json.access_token).catch(err => tmpErr = true);

        if (tmpErr) return res.redirect('/login');

        userInfos.guilds = guildsInfos;
        userInfos.oauth2 = json;
        req.session.user = userInfos;

        if (details.grant_type == 'refresh_token')
            res.render('home', {
                user: req.session.user,
                message: "Votre session a été rafraichie"
            });
        else
            res.redirect('/');
    }).catch(err => res.redirect('/login'));
}

function oauth2RQ(url, method, data) {
    return new Promise((resolve, reject) => {
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        };

        if (method == 'GET')
            headers['Authorization'] = 'Bearer ' + data;

        let opt = {
            method: method,
            headers: headers
        };

        if (method == 'POST')
            opt.body = data;

        fetch(url, opt)
            .then(res => res.json())
            .then(json => json.error ? reject(json) : resolve(json));
    });
}