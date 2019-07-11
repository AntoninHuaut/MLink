const config = require('../config.json');
const DiscordJS = require('discord.js');
const roleCheck = require('./utils');

let client = new DiscordJS.Client();
let registration = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    roleCheck.startRun();
});

client.on('message', async msg => {
    let args = msg.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    if (command == "refresh" && msg.author.id == config.discord.adminId) {
        roleCheck.checkOldRole(() => {
            msg.channel.send(":white_check_mark: Le refresh a été forcé").catch(err => {});
        });
        return;
    }

    if (msg.channel.type != "text")
        return;

    if (command == 'link') {
        if (!roleCheck.isAllowed(msg.member, msg.guild.id)) {
            msg.channel.send(`:x: Désolé, vous n'avez pas accès au système de link`).catch(err => {});
            return;
        }

        require('./selectGame').showGame(msg);
        return;
    } else if (registration[msg.author.id]) {
        if (registration[msg.author.id].status == "WAIT_GAME")
            require('./selectGame').selectGame(msg, msg.content.toLowerCase());
        else if (registration[msg.author.id].status == "WAIT_PSEUDO")
            require('./selectPseudo')(msg);
    }
});

client.login(config.discord.token).catch(err => {});

exports.getRegistration = () => {
    return registration;
}
exports.getClient = () => {
    return client;
}