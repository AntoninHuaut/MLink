const discord = require('./index');
const sql = require('../controllers/sql_c');
const config = require('../config.json');

function checkOldRole(callback) {
    sql.getAllUsers(result => {
        let nbDelete = 0;

        for (let i = 0; i < result.length; i++) {
            let idUser = result[i].idUser;
            let idServer = result[i].idServer;
            let guild = discord.getClient().guilds.get(idServer);
            let remove = false;

            if (!guild)
                remove = true;
            else {
                let member = guild.members.get(idUser);

                if (!member || !isAllowed(member, idServer))
                    remove = true;
            }

            if (remove)
                sql.deletePseudoUser(idUser, idServer, null, () => {
                    nbDelete++;
                });
        }

        if (nbDelete > 0)
            console.log(nbDelete + " user(s) deleted");

        if (callback)
            callback();

        sql.refreshSponsorList();
    });
}

function getRoleById(guildId) {
    if (!config.discord.server[guildId])
        return null;

    let roleId = config.discord.server[guildId].roleId;
    let guild = discord.getClient().guilds.get(guildId);

    if (!guild)
        return;

    let role = guild.roles.get(roleId);

    return !role ? undefined : role;
}

function isAllowed(member, guildId) {
    if (!config.discord.server[guildId])
        return true;

    let roleId = config.discord.server[guildId].roleId;

    return (member.roles.has(roleId) || member.hasPermission("ADMINISTRATOR"));
}

exports.getRoleById = getRoleById;
exports.checkOldRole = checkOldRole;
exports.isAllowed = isAllowed;
exports.startRun = () => {
    checkOldRole();
    setInterval(checkOldRole, 1000 * 60 * 60);
}