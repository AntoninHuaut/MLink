const mysql = require('mysql');
const config = require('../config.json');

var sponsorList = {};

function refreshSponsorList() {
    getCon(con => {
        let tmpSponsorList = {};

        checkTable(con, () => {
            con.query("select * from sponsor", function (err, result, fields) {
                if (err) throw err;

                result.forEach(get => {
                    if (!tmpSponsorList[get.typeGame]) {
                        tmpSponsorList[get.typeGame] = {};
                        tmpSponsorList[get.typeGame].users = {};
                        tmpSponsorList[get.typeGame].discord = {};
                    }

                    if (!tmpSponsorList[get.typeGame].discord[get.idServer]) {
                        tmpSponsorList[get.typeGame].users[get.idServer] = [];
                        tmpSponsorList[get.typeGame].discord[get.idServer] = {};
                    }

                    tmpSponsorList[get.typeGame].discord[get.idServer][get.idUser] = get.pseudo;
                    tmpSponsorList[get.typeGame].users[get.idServer].push(get.pseudo);
                });

                tmpSponsorList["typeGame"] = Object.keys(tmpSponsorList);
                sponsorList = tmpSponsorList;
            });
        });
    });
}

function updatePseudoUser(idUser, idServer, typeGame, newPseudo, callback) {
    getCon(con => {
        getPseudoUser(idUser, idServer, typeGame, pseudo => {
            if (pseudo)
                con.query("update sponsor set pseudo=? where idUser=? and idServer=? and typeGame=?", [newPseudo, idUser, idServer, typeGame], callback);
            else
                con.query("insert into sponsor(idUser, idServer, typeGame, pseudo) values (?, ?, ?, ?)", [idUser, idServer, typeGame, newPseudo], callback);
        });
    });
}

function getPseudoUser(idUser, idServer, typeGame, callback) {
    getCon(con => con.query("select pseudo from sponsor where idUser=? and idServer=? and typeGame=?", [idUser, idServer, typeGame], (err, result) => {
        callback(result.length == 0 ? null : result[0].pseudo);
    }));
}

function getAllUsers(callback) {
    getCon(con => con.query("select distinct idUser, idServer from sponsor", (err, result) => {
        callback(result);
    }));
}

function deletePseudoUser(idUser, idServer, typeGame, callback) {
    if (typeGame)
        getCon(con => con.query("delete from sponsor where idUser=? and idServer=? and typeGame=?", [idUser, idServer, typeGame], callback));
    else
        getCon(con => con.query("delete from sponsor where idUser=? and idServer=?", [idUser, idServer], callback));
}

function checkTable(con, callback) {
    con.query("create table if not exists sponsor (idUser varchar(48), idServer varchar(48), typeGame varchar(32)" +
        ", pseudo varchar(255), PRIMARY KEY(idUser, idServer, typeGame))", callback);
}

function getCon(callback) {
    let con = mysql.createConnection({
        host: config.sql.host,
        database: config.sql.database,
        user: config.sql.user,
        password: config.sql.password
    });

    con.connect(() => {
        callback(con);
    });
}

exports.deletePseudoUser = deletePseudoUser;
exports.getPseudoUser = getPseudoUser;
exports.getAllUsers = getAllUsers;
exports.updatePseudoUser = updatePseudoUser;

exports.refreshSponsorList = refreshSponsorList;
exports.getSponsorList = () => {
    return sponsorList;
}

exports.startRun = () => {
    refreshSponsorList();
    setInterval(refreshSponsorList, 1000 * 60 * 10);
}