const sql = require('./index');

exports.getManagedGames = (managedGuilds) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(managedGuilds) || !managedGuilds || managedGuilds.length == 0 || !managedGuilds[0])
            return reject("Paramètre incorrect");

        let con = sql.getConnection();

        let rqGuildId = "(";
        let paramsGuildId = [];
        managedGuilds.forEach(el => {
            rqGuildId += managedGuilds.indexOf(el) == 0 ? "?" : ",?";
            paramsGuildId.push(el.guildId);
        });
        rqGuildId += ")";

        con.query(`select * from game where guildId in ${rqGuildId}`, paramsGuildId, (err, result) => {
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

exports.updateGame = (guildId, nameGame, creatorId, roleId) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("INSERT INTO game (guildId, nameGame, creatorId, roleId) VALUES(?, ?, ?, ?)" +
            " ON DUPLICATE KEY UPDATE nameGame = VALUES(nameGame), roleId = VALUES(roleId)",
            [guildId, nameGame, creatorId, roleId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        con.end();
    });
}

exports.deleteGame = (idGame) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("DELETE FROM game WHERE idGame = ?",
            [idGame], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        con.end();
    });
}

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