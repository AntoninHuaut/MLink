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

function isAllowed(member, guildId) {
    if (!config.discord.server[guildId])
        return true;
    else if (member.hasPermission("ADMINISTRATOR"))
        return true;

    let roleIdList = config.discord.server[guildId].roleId;
    let hasRoleList = [];
    roleIdList.forEach(roleId => hasRoleList.push(member.roles.has(roleId)));

    return (hasRoleList.some(el => el));
}

exports.checkOldRole = checkOldRole;
exports.isAllowed = isAllowed;
exports.startRun = () => {
    checkOldRole();
    setInterval(checkOldRole, 1000 * 60 * 60);
}