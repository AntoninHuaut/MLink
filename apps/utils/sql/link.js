const sql = require('./index');

exports.getPseudo = (idGame, userId) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("select pseudo from link where idGame = ? and userId = ?", [idGame, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result[0] ? result[0].pseudo : undefined);
        });
        con.end();
    });
}

exports.updatePseudo = (idGame, userId, newPseudo) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("INSERT INTO link (idGame, userId, pseudo) VALUES(?, ?, ?)" +
            " ON DUPLICATE KEY UPDATE pseudo = VALUES(pseudo)", [idGame, userId, newPseudo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        con.end();
    });
}