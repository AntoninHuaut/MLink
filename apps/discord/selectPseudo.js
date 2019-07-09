const request = require("request");
const sql = require('../controllers/sql_c');
const discord = require('./index');

function selectPseudo(msg) {
    let typeGame = discord.getRegistration()[msg.author.id].typeGame;
    let idServer = discord.getRegistration()[msg.author.id].idServer;

    if (idServer != msg.guild.id) {
        delete discord.getRegistration()[msg.author.id];
        return;
    }

    let newPseudo = msg.content;

    if (typeGame == "minecraft")
        request(getOptionsMC(newPseudo), function (error, response, body) {
            if (body.length == 0)
                msg.channel.send(":x: Ce pseudo " + typeGame + " n'existe pas\nLa modification a été annulée").catch(err => {});
            else
                updatePseudoUser(msg.author.id, msg.guild.id, typeGame, newPseudo, msg.channel);
        });
    else
        updatePseudoUser(msg.author.id, msg.guild.id, typeGame, newPseudo, msg.channel);

    delete discord.getRegistration()[msg.author.id];
}

function updatePseudoUser(idDiscord, idServer, typeGame, newPseudo, channel) {
    sql.updatePseudoUser(idDiscord, idServer, typeGame, newPseudo, () => {
        channel.send(":white_check_mark: Votre pseudo `" + newPseudo + "` a été modifié pour le jeu " + typeGame +
            "\nCette modification peut prendre plusieurs minutes pour être prise en compte").catch(err => {});
        sql.refreshSponsorList();
    });
}

function getOptionsMC(pseudo) {
    return {
        method: 'GET',
        url: 'https://api.mojang.com/users/profiles/minecraft/' + pseudo,
        headers: {
            'cache-control': 'no-cache'
        }
    };
}

module.exports = selectPseudo;