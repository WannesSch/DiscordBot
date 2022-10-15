module.exports = (Discord, client) => {
    console.log(`${client.user.username} Is Online`);
    client.user.setActivity(`Choupaware`);
    global.Server.guild = client.guilds.cache.get("836756284795256893");
    global.Server.InitRoles();
    global.Server.CacheEmojis(client);

   if (global.config.settings.devmode) return;


    setTimeout(() => {
        var colorArr = ["🟦", "🟥", "🟨", "🟪", "🟩", "🟧",  "⬜", global.Server.Emojis.colors.cyan.id, global.Server.Emojis.colors.lime.id, global.Server.Emojis.colors.darkblue.id, "❌"]
        var roleArr = [
            ["Rust", global.Server.Emojis.icons.rust], 
            ["CS:GO", global.Server.Emojis.icons.csgo], 
            ["Valorant", global.Server.Emojis.icons.valorant], 
            ["Scrimmer", global.Server.Emojis.icons.scrim], 
            ["Patch Notes", global.Server.Emojis.icons.patchnodes]
        ];
    
    global.Server.roleChannel.bulkDelete(10, false);
    global.Server.mainChannel = ""

    var sEmbed = new Discord.MessageEmbed();
    sEmbed.setColor("ORANGE")
        .setTitle("Role Color")
        .setDescription("Choose a color by reacting.")

    global.Server.roleChannel.send({ embeds: [sEmbed] }).then(sentEmbed => {
        for (let i = 0; i<colorArr.length; i++) 
            sentEmbed.react(colorArr[i]);
    });

    var sb = "";
        
    for (let i = 0; i<roleArr.length; i++) {
        sb += `${roleArr[i][1]} ${roleArr[i][0]}\n`
    }
        
    var _sEmbed = new Discord.MessageEmbed();
        _sEmbed.setColor("ORANGE")
            .setTitle("Roles")
            .setDescription("Click on roles\n\n" + sb)

    global.Server.roleChannel.send({ embeds: [_sEmbed] }).then(sentEmbed => {
        for (let i = 0; i<roleArr.length; i++) {
            sentEmbed.react(roleArr[i][1].id);
        }
    });

    var __sEmbed = new Discord.MessageEmbed();
        __sEmbed.setColor("ORANGE")
            .setTitle("Private Channel")
            .setDescription("Click to Create Private Channel")

    global.Server.roleChannel.send({ embeds: [__sEmbed] }).then(sentEmbed => {
        sentEmbed.react("🆕");
    });
    }, 500);
    
}