const control = require('../utils/control');
const sql = require('../utils/sql');

exports.manage = async function (req, res) {
    res.render('game/manageGame', {
        user: req.session.user
    });
}

exports.selectGame = async function (req, res) {
    let callback = req.query.callback;
    if (callback) {
        req.session.user.selectGameCallback = callback;
        res.redirect("/game/selectGame");
        return;
    }

    let managedGuilds = control.getServerUserManage(req.session.user);
    control.getManagedGames(managedGuilds)
        .catch(err => res.send(getStatus(res, 403)))
        .then(manageGames => {
            res.render('game/selectGame', {
                user: req.session.user,
                manageGames: manageGames
            });
        });
}

exports.checkSelectGame = async function (req, res) {
    let callback = req.session.user.selectGameCallback;
    if (!callback)
        return res.redirect('/game');

    let gameSelect = req.body.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];
    if (!infoGame)
        return res.redirect('/game');

    req.session.user.gameSelect = gameSelect;
    res.redirect(callback);
}

exports.createGame = async function (req, res) {
    let managedGuilds = control.getServerUserManage(req.session.user);

    let opt = {
        user: req.session.user
    }

    if (managedGuilds.length > 0)
        opt.managedGuilds = managedGuilds;

    res.render('game/createGame', opt);
}

exports.checkEditGame = async function (req, res) {
    let guildId = req.body.serverSelect;

    if (!control.isUserManageGuild(req.session.user.id, guildId))
        return res.send(getStatus(res, 403));

    let gameName = req.body.gameName;
    let roleOnly = req.body.roleOnly;
    let idRoles = req.body.idRoles;

    if (!roleOnly)
        idRoles = "";

    sql.updateGame(guildId, gameName, req.session.user.id, idRoles)
        .catch(err => res.send(getStatus(res, 500)))
        .then(result => {
            let idGame = result.insertId;
            let data = getStatus(res, 200);
            data.idGame = idGame;
            res.send(data);
        });
}

exports.removeGame = async function (req, res) {
    if (!req.session.user.canManage || !req.session.user.infoGame)
        return res.redirect('/game');

    let infoGame = req.session.user.infoGame;
    infoGame.guildName = control.getGuildName(infoGame.guildId);

    res.render('game/removeGame', {
        user: req.session.user,
        infoGame: req.session.user.infoGame
    });
}

exports.checkRemoveGame = async function (req, res) {
    if (!req.session.user.canManage || !req.session.user.infoGame)
        return res.send(getStatus(res, 403));

    let gameSelect = req.session.user.gameSelect;
    sql.deleteGame(gameSelect)
    .catch(err => res.send(getStatus(res, 500)))
    .then(result => res.send(getStatus(res, 200)));
}

function getStatus(res, code) {
    res.status(code);

    return {
        status: code
    }
}