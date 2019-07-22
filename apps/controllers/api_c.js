const sql = require('../utils/sql');

module.exports = async function (req, res) {
    let idGames;

    try {
        idGames = JSON.parse(req.query.id);
    } catch (e) {}

    if (!Array.isArray(idGames) || !isIntArray(idGames))
        return res.send(getErr(400, "/api?id=[(idGame), ...]"));

    sql.getAllLink(idGames)
        .catch(err => {
            res.send(getErr(500, "Server error"))
        })
        .then(result => {
            let json = {};
            json.games = [];
            json.pseudo = [];

            result.forEach(el => {
                if (json.games.filter(game => game.idGame === el.idGame).length == 0)
                    json.games.push({
                        idGame: el.idGame,
                        nameGame: el.nameGame,
                        guildId: el.guildId,
                        roleId: (el.roleId ? el.roleId.split(',') : [])
                    })

                if (!json.pseudo.includes(el.pseudo))
                    json.pseudo.push(el.pseudo);
            });

            res.send(json);
        });
}

function getErr(code, msg) {
    return {
        code: code,
        message: msg
    }
}

function isIntArray(array) {
    return array.every(el => typeof (el) === 'number');
}