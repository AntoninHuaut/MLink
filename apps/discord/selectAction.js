const sql = require('../controllers/sql_c');
const DiscordJS = require('discord.js');
const discord = require('./index');

function linkCommand(msg) {
    let typeGame = discord.getRegistration()[msg.author.id].typeGame;

    sql.getPseudoUser(msg.author.id, msg.guild.id, typeGame, (pseudo) => {
        let embed = new DiscordJS.RichEmbed()
            .setTitle("MLink - Liaison " + typeGame)
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor("#FF5A37")
            .setDescription("Utilisez les réactions pour effectuer la liaison" +
                (pseudo ? "\nPseudo enregistré : " + pseudo : ""))
            .addField("Réactions", ":arrows_counterclockwise: Modifier le pseudo\n:x: Supprimer le pseudo", false);

        msg.channel.send(embed).catch(err => {}).then((embedMsg) => {
            embedMsg.react("🔄").then(() => embedMsg.react("❌"));

            const filter = (react, user) => {
                return ['🔄', '❌'].includes(react.emoji.name) && user.id == msg.author.id;
            };

            embedMsg.awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                })
                .then(reacts => {
                    if (!discord.getRegistration()[msg.author.id])
                        return;

                    const react = reacts.first();
                    let registration = discord.getRegistration();

                    if (registration[msg.author.id].status != "WAIT_ACTION")
                        return;

                    let msgTypeGame = `:wrench: Jeu : ${typeGame}\n`;

                    if (react.emoji.name == "🔄") {
                        registration[msg.author.id].status = "WAIT_PSEUDO";
                        embedMsg.channel.send(`${msgTypeGame}:clock2: Veuillez entrer votre pseudo`).catch(err => {});
                    } else {
                        delete registration[msg.author.id];

                        if (pseudo)
                            sql.deletePseudoUser(msg.author.id, msg.guild.id, typeGame, () => {
                                embedMsg.channel.send(`${msgTypeGame}:white_check_mark: Votre pseudo a été supprimé`).catch(err => {});
                            });
                        else
                            embedMsg.channel.send(`${msgTypeGame}:x: Vous n'avez pas de pseudo enregistré`).catch(err => {});
                    }
                })
                .catch(() => delete discord.getRegistration()[msg.author.id])
                .finally(() => embedMsg.clearReactions().catch(err => {}));
        });
    });
}

module.exports = linkCommand;