const sql = require('./sql');
const discord = require('./../discord');

exports.checkOldRole = () => {
    return new Promise((resolve, reject) => {
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

            sql.refreshSponsorList();
            resolve();
        });
    });
}

exports.getGamesOnServer = (profile) => {
    return new Promise((resolve, reject) => {
        sql.getGames().catch(err => reject(err)).then(games => {
            let removeGuild = [];
            let usersGuilds = [];

            profile.guilds.forEach(guild => usersGuilds.push(guild.id));

            games.forEach(game => {
                if (!removeGuild.includes(game.guildId) && !usersGuilds.includes(game.guildId))
                    removeGuild.push(game.guildId);
            });

            games = games.filter(game => !removeGuild.includes(game.guildId));
            resolve(games);
        });
    });
}

exports.getGamesAccess = (profile) => {
    return new Promise((resolve, reject) => {
        this.getGamesOnServer(profile).catch(err => reject(err)).then(gamesOnServer => {
            gamesOnServer = gamesOnServer.filter(game => this.canGamesAccess(profile.id, game.guildId, game.roleId));
            gamesOnServer.forEach((game, index, array) => {
                game.guildName = discord.getClient().guilds.get(game.guildId).name;
                array[index] = game;
            });
            resolve(gamesOnServer);
        });
    });
}

exports.canGamesAccess = (userId, guildId, roleId) => {
    let guild = discord.getClient().guilds.get(guildId);
    if (!guild) return false;

    let member = guild.member(userId);
    if (!member) return false;
    if (member.hasPermission("MANAGE_GUILD")) return true;
    if (!roleId[0]) return true;

    let hasRoleList = [];
    roleId.forEach(roleId => hasRoleList.push(member.roles.has(roleId)));

    return hasRoleList.some(el => el);
}