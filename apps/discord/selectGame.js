const DiscordJS = require('discord.js');
const discord = require('./index');
const config = require('../config.json');

function showGame(msg) {
    if (config.game.length == 0) {
        msg.channel.send(`:x: ${author.tag} Aucun jeux disponibles`);
        return;
    } else if (config.game.length == 1) {
        createRegistration(msg.author.id, msg.guild.id);
        selectGame(msg, config.game[0]);
        return;
    }

    let gameList = '';
    config.game.forEach(game => gameList += `• ${game}\n`);

    let embed = new DiscordJS.RichEmbed()
        .setTitle("MLink - Liaison")
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor("#FF5A37")
        .setDescription("Tapez un des noms de jeu suivant pour continuer")
        .addField("Jeux disponibles :", gameList, false);

    msg.channel.send(embed).catch(err => {}).then((embedMsg) => createRegistration(msg.author.id, msg.guild.id));
}

function createRegistration(idAuthor, idServer) {
    let registration = discord.getRegistration();
    registration[idAuthor] = {};
    registration[idAuthor].status = "WAIT_GAME";
    registration[idAuthor].idServer = idServer;
}

function selectGame(msg, gameSelect) {
    let idServer = discord.getRegistration()[msg.author.id].idServer;

    if (idServer != msg.guild.id) {
        delete discord.getRegistration()[msg.author.id];
        return;
    }

    if (!config.game.includes(gameSelect)) {
        delete discord.getRegistration()[msg.author.id];
        msg.channel.send(":x: Ce jeu (" + gameSelect + ") n'existe pas\nLa modification a été annulée").catch(err => {});
    } else {
        discord.getRegistration()[msg.author.id].typeGame = gameSelect;
        discord.getRegistration()[msg.author.id].status = "WAIT_ACTION";
        require('./selectAction')(msg);
    }
}

exports.showGame = showGame;
exports.selectGame = selectGame;