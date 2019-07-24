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
    res.render('home', {
        user: req.session.user,
        message: "Fonction non implémentée"
    });
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

function getStatus(res, code) {
    res.status(code);

    return {
        status: code
    }
}