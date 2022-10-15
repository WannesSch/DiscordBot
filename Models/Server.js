const { MessageEmbed } = require('discord.js');

class Server {
    constructor(client) {
        this.guild = null;
        this.roleChannel = {};
        this.modChannel = {};
        this.mainChannel = {};
        this.rankupChannel = {};
        this.eventChannel = {};
        this.gamesChannel = {};
        this.colorRoles = { blue: {}, red: {}, yellow: {}, purple: {}, green: {}, orange: {}, white: {}, lime: {}, darkblue: {}, cyan: {} }
        this.Roles = { rust: {}, csgo: {}, valorant: {}, scrimmer: {}, patchnotes: {}, runescape: {} }
        this.privateChannels = [];
        this.checkInterval;
        this.hasLiveUpdate = false;
        this.serverid = "";
        this.sentEmbed;
        this.serverID = "";
        this.wipeEmbed = "";
        this.signMembers = [];
        this.previousMessageAuthorId = null;

        this.Emojis = {};
    }
    InitRoles() {
        this.roleChannel = this.guild.channels.cache.get('933866734480412702');
        this.modChannel = this.guild.channels.cache.get('836927323370422273');
        this.mainChannel = this.guild.channels.cache.get("837079623417856050");
        this.rankupChannel = this.guild.channels.cache.get('985203192553930812');
        this.eventChannel = this.guild.channels.cache.get('985203723431186472');
        this.gamesChannel = this.guild.channels.cache.get('985903976530735134');

        this.colorRoles = {
            blue: this.guild.roles.cache.get("836945135559770114"),
            red: this.guild.roles.cache.get("836945074369200148"),
            yellow: this.guild.roles.cache.get("836945285137563658"),
            purple: this.guild.roles.cache.get("836945313473495051"),
            green: this.guild.roles.cache.get("836945228341575700"),
            orange: this.guild.roles.cache.get("836945173501444126"),
            white: this.guild.roles.cache.get("836945345270251531"),
            lime: this.guild.roles.cache.get("838492788957773854"),
            darkblue: this.guild.roles.cache.get("838492344947965974"),
            cyan: this.guild.roles.cache.get("838472512715096075"),
        }

        this.Roles = {
            rust: this.guild.roles.cache.get("836980833973567498"),
            csgo: this.guild.roles.cache.get("836980861831217173"),
            valorant: this.guild.roles.cache.get("836981221321474098"),
            scrimmer: this.guild.roles.cache.get("836944228898177056"),
            patchnotes: this.guild.roles.cache.get("836981359057567807"),
            runescape: this.guild.roles.cache.get("904829312446906379")
        }
    }
    RemoveChannelByID(id) {
        var ch = null;
        for (let i = 0; i<this.privateChannels.length; i++) {
            if (this.privateChannels[i].id == id) ch = this.privateChannels[i];
        }
        this.privateChannels.splice(this.privateChannels.indexOf(ch), 1);
    }
    async FixRankRolesAsync(memberid) {
        if (!this.guild) return;
        
        let _1 = this.guild.roles.cache.get("836943903055675412");
        let _2 = this.guild.roles.cache.get("836943964045049887");
        let _3 = this.guild.roles.cache.get("836944006809649163");
        let _4_10 = this.guild.roles.cache.get("837092842614423615");
        let _member = this.guild.members.cache.get(memberid);

        let leaderBoardIndex = await global.UserRepository.FindUserIndexOnLeaderboard(memberid);
        
        switch(true) {
            case (leaderBoardIndex == 1): {
                if (!_member._roles.includes(_1.id)) {
                    _member.roles.remove(_2);
                    _member.roles.remove(_3);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_1); 
                }
                break;
            }
            case (leaderBoardIndex == 2): {
                if (!_member._roles.includes(_2.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_3);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_2); 
                }
                break;
            }
            case (leaderBoardIndex == 3): {
                if (!_member._roles.includes(_3.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_2);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_3); 
                }
                break;
            }
            case (leaderBoardIndex <= 10): {
                if (!_member._roles.includes(_4_10.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_2);
                    _member.roles.remove(_3);
                    _member.roles.add(_4_10); 
                }
                break;
            }
            case (leaderBoardIndex > 10): {
                _member.roles.remove(_1);
                _member.roles.remove(_2);
                _member.roles.remove(_3);
                _member.roles.remove(_4_10);
                break;
            }
        }
    }
    ClearColors(member) {
        member.roles.remove(this.colorRoles.red);
        member.roles.remove(this.colorRoles.blue);
        member.roles.remove(this.colorRoles.yellow);
        member.roles.remove(this.colorRoles.purple);
        member.roles.remove(this.colorRoles.green);
        member.roles.remove(this.colorRoles.orange);
        member.roles.remove(this.colorRoles.white);
        member.roles.remove(this.colorRoles.cyan);
        member.roles.remove(this.colorRoles.darkblue); 
        member.roles.remove(this.colorRoles.lime); 
    }
    InitColors(colorArr) {
        this.colorRoles.blue = this.guild.roles.cache.get(colorArr[0]);
        this.colorRoles.red = this.guild.roles.cache.get(colorArr[1]);
        this.colorRoles.yellow = this.guild.roles.cache.get(colorArr[2]);
        this.colorRoles.purple = this.guild.roles.cache.get(colorArr[3]);
        this.colorRoles.green = this.guild.roles.cache.get(colorArr[4]);
        this.colorRoles.orange = this.guild.roles.cache.get(colorArr[5]);
        this.colorRoles.white = this.guild.roles.cache.get(colorArr[6]);
        this.colorRoles.lime = this.guild.roles.cache.get(colorArr[7]);
        this.colorRoles.darkblue = this.guild.roles.cache.get(colorArr[8]);
        this.colorRoles.cyan = this.guild.roles.cache.get(colorArr[9]);
    }
    StartInterval() {
        setInterval(() => {
            var category = this.guild.channels.cache.find(c => c.name == "Private Channels" && c.type == "category");
            category.children.forEach(channel => {
                var _ch = this.guild.channels.cache.get(channel.id);
                if (channel.members.size == 0) {
                    _ch.delete();
                    this.RemoveChannelByID(channel.id)
                } 
            });
        }, 15 * 1000);
    }
    MakeChannel() {
        this.guild.channels.create("Private " + this.privateChannels.length, {type: "GUILD_VOICE"}).then(channel => {
            channel.setParent("837064913595662387"); 
            this.privateChannels.push(channel);
            setTimeout(() => {
                if(channel.members.size == 0) {
                    channel.delete();
                    this.RemoveChannelByID(channel.id);
                }
            }, 60* 1000);
        }).catch(console.error);
    }
    CheckActiveChannels() {
        var category = this.guild.channels.cache.find(c => c.name == "Private Channels" && c.type == "category");
        category.children.forEach(channel => {
            var _ch = this.guild.channels.cache.get(channel.id);
            if (channel.members.size == 0) {
                setTimeout(() => {
                    _ch.delete();
                    this.RemoveChannelByID(channel.id)
                }, 60* 1000);
            } 
        });
    }
    Message(title, msg, color, channel, shouldremove) {
        if (!color) color = "#9c1414";
        var sEmbed = new MessageEmbed()
            .setColor(color)
            if (title != null) sEmbed.setTitle(title);
            sEmbed.setDescription(msg)
            .setTimestamp()

        try {
            channel.send({ embeds: [sEmbed] }).then((sentEmbed) => {
                if (!shouldremove) return;
                setTimeout(() => { sentEmbed.delete(); }, 5000);
            });
        }
        catch (ex) {console.error(ex);}
    }
    CacheEmojis(client) {
        this.Emojis = {
            cards: {
                clubs: {
                    ace: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "aceclubs"),
                    two: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "2clubs"),
                    three: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "3clubs"),
                    four: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "4clubs"),
                    five: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "5clubs"),
                    six: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "6clubs"),
                    seven: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "7clubs"),
                    eight: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "8clubs"),
                    nine: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "9clubs"),
                    ten: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "10clubs"),
                    jack: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "jackclubs"),
                    queen: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "queenclubs"),
                    king: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "kingclubs")
                },
                spades: {
                    ace: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "acespades"),
                    two: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "2spades"),
                    three: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "3spades"),
                    four: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "4spades"),
                    five: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "5spades"),
                    six: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "6spades"),
                    seven: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "7spades"),
                    eight: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "8spades"),
                    nine: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "9spades"),
                    ten: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "10spades"),
                    jack: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "jackspades"),
                    queen: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "queenspades"),
                    king: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "kingspades")
                },
                diamonds: {
                    ace: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "acediamonds"),
                    two: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "2diamonds"),
                    three: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "3diamonds"),
                    four: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "4diamonds"),
                    five: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "5diamonds"),
                    six: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "6diamonds"),
                    seven: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "7diamonds"),
                    eight: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "8diamonds"),
                    nine: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "9diamonds"),
                    ten: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "10diamonds"),
                    jack: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "jackdiamonds"),
                    queen: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "queendiamonds"),
                    king: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "kingdiamonds")
                },
                hearts: {
                    ace: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "acehearts"),
                    two: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "2hearts"),
                    three: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "3hearts"),
                    four: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "4hearts"),
                    five: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "5hearts"),
                    six: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "6hearts"),
                    seven: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "7hearts"),
                    eight: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "8hearts"),
                    nine: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "9hearts"),
                    ten: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "10hearts"),
                    jack: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "jackhearts"),
                    queen: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "queenhearts"),
                    king: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "kinghearts")
                }

            },
            cars: {
               berlingo: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "citroenberlingo"),
               adam: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "opeladam"),
               captur: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "renaultcaptur"),
               scirocco: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "vwScirocco"),
               id3:  client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "vwid3")
            },
            colors: {
                cyan: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "CYAN"),
                darkblue: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "DARKBLUE"),
                lime: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "LIME")
            },
            dealnodeal: {
                blank: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Blank"),
                one: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_One"),
                two: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Two"),
                three: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Three"),
                four: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Four"),
                five: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Five"),
                six: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Six"),
                seven: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Seven"),
                eight: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Eight"),
                nine: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Nine"),
                ten: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Ten"),
                eleven: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Eleven"),
                twelve: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Twelve"),
                tirteen: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Tirteen"),
                fourteen: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Fourteen"),
                fifteen: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Fifteen"),
                sixteen:  client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "DND_Sixteen")
            },
            icons: {
                csgo: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "csgo"),
                patchnodes: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "patchnotes"),
                rust: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "rust"),
                scrim: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "scrim"),
                valorant: client.guilds.cache.get('1027225242457870476').emojis.cache.find(emoji => emoji.name === "valorant")
            },
            coins: {
                red: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "coinRed"),
                green: client.guilds.cache.get('1027194753789476926').emojis.cache.find(emoji => emoji.name === "coinGreen")
            }

        }
    }
}

module.exports = { Server };