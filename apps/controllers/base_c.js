const sql = require('./sql_c');

module.exports = async function (req, res) {
    res.json(getJson(req.params.typeGame, req.params.idServer, req.params.typeObject));
}

function getJson(typeGame, idServer, typeObject) {
    if (!sql.getSponsorList())
        return getJsonErr("Initialization did not end");

    else if (!typeGame)
        return sql.getSponsorList().typeGame;
    else if (!sql.getSponsorList()[typeGame])
        return getJsonErr("Unknown game type");

    else if (!typeObject)
        return sql.getSponsorList()[typeGame];
    else if (!sql.getSponsorList()[typeGame][typeObject])
        return getJsonErr("Unknown object type");

    else if (!idServer)
        return sql.getSponsorList()[typeGame][typeObject];
    else if (!sql.getSponsorList()[typeGame][typeObject][idServer])
        return getJsonErr("Unknown server id");

    else
        return sql.getSponsorList()[typeGame][typeObject][idServer];
}

function getJsonErr(err) {
    return JSON.parse('{"error": "' + err + '"}');
}