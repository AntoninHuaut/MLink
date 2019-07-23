const discord = require('../discord');
const sql = require('../utils/sql');
const control = require('../utils/control');

exports.selectGame = async function (req, res) {
    let gameList = await control.getGamesAccess(req.session.user);
    let opt = {
        user: req.session.user,
        gameList: gameList
    };

    if (gameList.length == 0)
        delete opt.gameList;

    res.render('selectGame', opt);
}

exports.selectPseudo = async function (req, res) {
    let gameSelect = req.session.user.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];

    if (!infoGame)
        return res.redirect('/link');

    let canAccess = control.canGamesAccess(req.session.user.id, infoGame.guildId, infoGame.roleId ? infoGame.roleId.split(',') : []);
    let guildName = discord.getClient().guilds.get(infoGame.guildId).name;

    if (!canAccess)
        return res.redirect('/link');

    let pseudo = (await sql.getPseudo(gameSelect, req.session.user.id).catch(err => {}));
    let opt = {
        user: req.session.user,
        guildName: guildName,
        nameGame: infoGame.nameGame
    };

    if (pseudo)
        opt.pseudo = pseudo;

    res.render('selectPseudo', opt);
}

exports.checkSelectGame = async function (req, res) {
    let gameSelect = req.body.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];
    if (!infoGame)
        return res.redirect('/link');

    req.session.user.gameSelect = gameSelect;
    res.redirect(`/link/selectPseudo`);
}

exports.checkSelectPseudo = async function (req, res) {
    let gameSelect = req.session.user.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];

    if (!infoGame)
        return res.send({
            status: 500
        });

    let newPseudo = req.body.newPseudo;
    if (!newPseudo || newPseudo.trim() == '')
        return res.send({
            status: 400
        });

    sql.updatePseudo(gameSelect, req.session.user.id, newPseudo)
        .then(() => res.send({
            status: 200
        }))
        .catch(err => res.send({
            status: 500
        }));
}