const { server } = require("../../Classes/Server.js");

module.exports = (Discord, client, reaction, user) => {
    if (user.bot) return;

    var member = global.Server.guild.members.cache.get(user.id);

    switch(reaction.emoji.name) {
        case "rust": member.roles.remove(server.Roles.rust);    break;
        case "csgo": member.roles.remove(server.Roles.csgo);     break;
        case "valorant": member.roles.remove(server.Roles.valorant);  break;
        case "scrim": member.roles.remove(server.Roles.scrimmer);  break;
        case "patchnotes": member.roles.remove(server.Roles.patchnotes);   break;
        case "runescape": member.roles.remove(server.Roles.runescape);   break;
    }
}