const mysql = require('mysql');
const config = require('../../config.json');
const fs = require('fs');
const readline = require('readline');

function initTable() {
    let rl = readline.createInterface({
        input: fs.createReadStream('./apps/utils/sql/table.sql'),
        terminal: false
    });
    let con = this.getConnection();
    rl.on('line', chunk => con.query(chunk.toString('utf-8'), (err) => {}));
    rl.on('close', () => con.end());
}

function getAllLink(idGames) {
    return new Promise((resolve, reject) => {
        let con = this.getConnection();
        let idGamesSQL = ` where idGame in (`;

        idGames.forEach(el => {
            if (idGames.indexOf(el) != 0)
                idGamesSQL += ",";
            idGamesSQL += "?";
        });

        idGamesSQL += ")";

        let rq = `SELECT * FROM link join game using (idGame)`;

        if (idGames.length > 0)
            rq += idGamesSQL;

        con.query(rq, idGames, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });

        con.end();
    });
}

exports.getOptions = () => {
    return {
        host: config.sql.host,
        port: config.sql.port,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database
    };
}
exports.initTable = initTable;
exports.getAllLink = getAllLink;
exports.getConnection = () => {
    let con = mysql.createConnection(this.getOptions());
    con.connect();
    return con;
};

const gameSQL = require('./game');
exports.getManagedGames = gameSQL.getManagedGames;
exports.updateGame = gameSQL.updateGame;
exports.getGames = gameSQL.getGames;
exports.getInfoGame = gameSQL.getInfoGame;
exports.deleteGame = gameSQL.deleteGame;

const linkSQL = require('./link');
exports.getPseudo = linkSQL.getPseudo;
exports.updatePseudo = linkSQL.updatePseudo;

const usersManageSQL = require('./usersManage');
exports.isUserCanManage = usersManageSQL.isUserCanManage;