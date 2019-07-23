const sql = require('./sql');
const discord = require('./../discord');

exports.checkOldRole = () => {
    return new Promise((resolve, reject) => {
        sql.getAllLink([])
            .catch(err => {})
            .then(result => {
                if (!result || discord.getClient().status != 0)
                    return;

                let removeLink = [];

                result.forEach(el => {
                    if (!this.canGamesAccess(el.userId, el.guildId, el.roleId))
                        removeLink.push(el);
                });

                let con = sql.getConnection();

                removeLink.forEach(el => {
                    con.query("delete from link where idGame = ? and userId = ?", [el.idGame, el.userId], (err, result) => {});
                });

                con.end(err => {
                    if (err) reject(err);
                    resolve();
                })
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
    if (!guild) return true;

    let member = guild.member(userId);
    if (!member) return false;
    if (member.hasPermission("MANAGE_GUILD")) return true;
    if (!Array.isArray(roleId) || !roleId[0]) return true;

    let hasRoleList = [];
    roleId.forEach(roleId => hasRoleList.push(member.roles.has(roleId)));

    return hasRoleList.some(el => el);
}