const sql = require('./sql');
const discord = require('./../discord');

exports.getManagedGames = (managedGuilds) => {
    return new Promise((resolve, reject) => {
        sql.getManagedGames(managedGuilds).catch(err => reject(err))
            .then(manageGames => {
                manageGames.forEach((game, index, array) => {
                    game.guildName = this.getGuildName(game.guildId);
                    array[index] = game;
                });
                resolve(manageGames);
            });
    });
};

exports.getServerUserManage = (profile) => {
    let userId = profile.id;
    let managedGuild = [];

    profile.guilds.forEach(guild => {
        if (this.isUserManageGuild(userId, guild.id))
            managedGuild.push({
                guildId: guild.id,
                guildName: guild.name
            })
    });

    return managedGuild;
}

exports.isUserManageGuild = (userId, guildId) => {
    let guild = discord.getClient().guilds.get(guildId);
    if (!guild) return false;

    let member = guild.member(userId);
    if (!member) return false;
    return (member.hasPermission("MANAGE_GUILD"));
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
                game.guildName = this.getGuildName(game.guildId);
                array[index] = game;
            });
            resolve(gamesOnServer);
        });
    });
}

exports.canGamesAccess = (userId, guildId, roleId) => {
    if (!roleId) return true;

    let guild = discord.getClient().guilds.get(guildId);
    if (!guild) return true;

    if (!Array.isArray(roleId))
        roleId = roleId.split(',');
    if (!roleId[0]) return true;

    let member = guild.member(userId);
    if (!member) return false;
    if (member.hasPermission("MANAGE_GUILD")) return true;

    let hasRoleList = [];
    roleId.forEach(roleId => hasRoleList.push(member.roles.has(roleId)));

    return hasRoleList.some(el => el);
}

exports.getGuildName = (guildId) => {
    return discord.getClient().guilds.get(guildId).name;
}

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