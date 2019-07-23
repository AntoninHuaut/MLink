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

exports.checkSelectGame = async function (req, res) {
    let gameSelect = req.body.gameSelect;
    let infoGame = (await sql.getInfoGame(gameSelect).catch(err => {}))[0];
    if (!infoGame)
        return res.redirect('/link');

    req.session.user.gameSelect = gameSelect;
    res.redirect(`/link/selectPseudo`);
}

exports.selectPseudo = async function (req, res) {
    let gameSelect = req.session.user.gameSelect;
    let infoGame = req.session.user.infoGame;

    if (!infoGame || !req.session.user.canAccess)
        return res.redirect('/link');

    let guildName = discord.getClient().guilds.get(infoGame.guildId).name;

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

exports.checkSelectPseudo = async function (req, res) {
    let gameSelect = req.session.user.gameSelect;
    let infoGame = req.session.user.infoGame;

    if (!req.session.user.canAccess)
        return res.send(getStatus(res, 403));

    if (!infoGame)
        return res.send(getStatus(res, 500));

    let newPseudo = req.body.newPseudo;
    if (!newPseudo || newPseudo.trim() == '')
        return res.send(getStatus(res, 400));

    sql.updatePseudo(gameSelect, req.session.user.id, newPseudo)
        .then(() => res.send(getStatus(res, 200)))
        .catch(err => res.send(getStatus(res, 500)));
}

function getStatus(res, code) {
    res.status(code);
    
    return {
        status: code
    }
}