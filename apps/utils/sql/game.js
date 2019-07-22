const sql = require('./index');

exports.getInfoGame = (idGame) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("select * from game where idGame = ?", [idGame], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        con.end();
    });
}

exports.getGames = () => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("select * from game", (err, result) => {
            if (err) return reject(err);

            let games = [];

            result.forEach(res => games.push({
                idGame: res.idGame,
                guildId: res.guildId,
                nameGame: res.nameGame,
                creatorId: res.creatorId,
                roleId: (res.roleId ? res.roleId.split(',') : [])
            }));

            resolve(games);
        });
        con.end();
    });
}