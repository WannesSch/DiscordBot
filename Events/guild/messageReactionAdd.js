module.exports = (Discord, client, reaction, user) => {
    if (user.bot) return;

    var member = global.Server.guild.members.cache.get(user.id);
    let server = global.Server;

    switch(reaction.emoji.name) {
        case "🟦": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.blue); 
            reaction.users.remove(user.id);
        }   break;
        case "🟥": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.red);
            reaction.users.remove(user.id);
        }   break;
        case "🟨": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.yellow); 
            reaction.users.remove(user.id);
        }    break;
        case "🟪": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.purple); 
            reaction.users.remove(user.id);
        }    break;
        case "🟩": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.green); 
            reaction.users.remove(user.id);
        }     break;
        case "🟧": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.orange);
            reaction.users.remove(user.id);
        }    break;
        case "⬜": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.white);
            reaction.users.remove(user.id);
        }     break;
        case "LIME": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.lime); 
            reaction.users.remove(user.id);
        } break;
        case "DARKBLUE": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.darkblue); 
            reaction.users.remove(user.id);
        } break;
        case "CYAN": {
            server.ClearColors(member);
            member.roles.add(server.colorRoles.cyan); 
            reaction.users.remove(user.id);
        } break;
        case "❌": {
            server.ClearColors(member);
            reaction.users.remove(user.id);
        } break;
        
        case "🆕": {
            server.MakeChannel();
            reaction.users.remove(user.id);
        } break;
        case "🔄": {
            var scrim = scrims.FindScrimByMsgID(reaction.message.id);
            if (user.id != scrim.usermsg.author.id) {reaction.users.remove(user.id); return;}

            scrim.team1sb = "";
            scrim.team2sb = "";
            var _sEmbed = server.Scramble(scrim);

            reaction.message.edit(_sEmbed).then(sentEmbed => {
                sentEmbed.react('842432223256772619')
            });
            reaction.users.remove(user.id);
        } break;
        case "✅": {
            var scrim = scrims.FindScrimByMsgID(reaction.message.id);
            if (user.id != scrim.usermsg.author.id) {reaction.users.remove(user.id); return;}

            var _sEmbed = server.StartScrim(scrim);
            reaction.message.edit(_sEmbed)

            reaction.users.remove(user.id);
        } break;
        case "🛑": {
            var scrim = scrims.FindScrimByMsgID(reaction.message.id);
            if (user.id != scrim.usermsg.author.id) {reaction.users.remove(user.id); return;}

            server.EndScrim(scrim, reaction.message);
            reaction.users.remove(user.id);
        } break;

        case "rust": member.roles.add(server.Roles.rust);    break;
        case "csgo": member.roles.add(server.Roles.csgo);     break;
        case "valorant": member.roles.add(server.Roles.valorant);  break;
        case "scrim": member.roles.add(server.Roles.scrimmer);  break;
        case "patchnotes": member.roles.add(server.Roles.patchnotes);   break;
        case "runescape": member.roles.add(server.Roles.runescape);   break;

        case "STAND": {
            var game = games.FindGameByUser(user);
            if (game == null) return;
            if (user.id != game.user.id) {reaction.users.remove(user.id); return;}
            var gameUser = users.FindUserByDiscordID(user.id)

            var userSb = "";
                userSb += "**" + game.gameData.userCards[0].cardnumber + "**" +  game.gameData.userCards[0].emoji + " ";
                userSb += "**" + game.gameData.userCards[1].cardnumber + "**" +  game.gameData.userCards[1].emoji;
                userSb += "**" + game.gameData.userCards[2].cardnumber + "**" +  game.gameData.userCards[2].emoji;
                userSb += "\nTotal:**" + parseInt(game.gameData.userCards[0].value + game.gameData.userCards[1].value + game.gameData.userCards[2].value) + "**";
        
            var dealerSb = "bruh";
                dealerSb += "**" + game.gameData.dealerCards[0].cardnumber + "**" +  game.gameData.dealerCards[0].emoji + " ";
                dealerSb += "**" + game.gameData.dealerCards[1].cardnumber + "**" +  game.gameData.dealerCards[1].emoji;
                dealerSb += "**" + game.gameData.dealerCards[2].cardnumber + "**" +  game.gameData.dealerCards[2].emoji;
                dealerSb += "\nTotal:**" + parseInt(game.gameData.dealerCards[0].value + game.gameData.dealerCards[1].value + game.gameData.dealerCards[2].value) + "**";

            var profit = parseInt(game.gameData.bet / 2);
            gameUser.coins += profit;

            game.embed = new Discord.MessageEmbed();
            game.embed.setColor("#a83232")
            .setTitle("Blackjack " + game.user.username)
            .addFields(
                { 
                    name: 'Fold', 
                    value: userSb, 
                    inline: true 
                },
                { 
                    name: 'Dealers hand', 
                    value: dealerSb, 
                    inline: true        
                },
                { 
                    name: 'Profit', 
                    value: "**-" + profit + "** Coins"
                },
                { 
                    name: 'Coins', 
                    value: "You have **" + gameUser.coins + "** coins."
                },
            )

            reaction.message.edit(game.embed)
            reaction.users.remove(user.id);
        } break;
        case "HIT": {

        } break;
        case "FOLD": {
            var game = games.FindGameByUser(user);
            if (game == null) return;
            if (user.id != game.user.id) {reaction.users.remove(user.id); return;}
            
            game.Blackjack('Fold');
            setTimeout(() => {
                games.EndGame(game);
            }, 5000);

            reaction.message.edit(game.embed)
            reaction.users.remove(user.id);
        } break;
    }
}