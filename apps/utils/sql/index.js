const mysql = require('mysql');
const config = require('../../config.json');
const fs = require('fs');
const readline = require('readline');

function initTable() {
    let rl = readline.createInterface({
        input: fs.createReadStream('./apps/utils/sql/table.sql'),
        terminal: false
    });
    let con = getConnection();
    rl.on('line', chunk => con.query(chunk.toString('utf-8'), (err) => {}));
    rl.on('close', () => con.end());
}

function getAllLink(idGames) {
    return new Promise((resolve, reject) => {
        let con = getConnection();
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

function getConnection() {
    let con = mysql.createConnection({
        host: config.sql.host,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database
    });
    con.connect();
    return con;
}

exports.initTable = initTable;
exports.getAllLink = getAllLink;
exports.getConnection = getConnection;

const gameSQL = require('./game');
exports.getGames = gameSQL.getGames;
exports.getInfoGame = gameSQL.getInfoGame;

const linkSQL = require('./link');
exports.getPseudo = linkSQL.getPseudo;
exports.updatePseudo = linkSQL.updatePseudo;