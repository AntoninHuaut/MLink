const config = require('../config.json');
const DiscordJS = require('discord.js');
const control = require('../utils/control');

let client = new DiscordJS.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    let args = msg.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    if (command == "refresh" && msg.author.id == config.discord.adminId)
        return control.checkOldRole().then(() => {
            msg.channel.send(":white_check_mark: Le refresh a été forcé").catch(err => {});
        });

    if (msg.channel.type != "text")
        return;

    if (command == 'link') {
        let embed = new DiscordJS.RichEmbed()
            .setTitle("MLink - Liaison")
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor("#FF5A37")
            .addField("Gérer vos liaison", "Sur https://mlink.maner.fr/");

        msg.channel.send(embed).catch(err => {});
    }
});

client.login(config.discord.token).catch(err => {});

exports.getClient = () => {
    return client;
}