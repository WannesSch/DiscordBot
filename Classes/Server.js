const { MessageEmbed } = require('discord.js');

class Server {
    constructor() {
        this.guild = {};
        this.roleChannel = {};
        this.modChannel = {};
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
        this.previousMessage = null;
    }
    InitRoles() {
        this.roleChannel = this.guild.channels.cache.get('933866734480412702');
        this.modChannel = this.guild.channels.cache.get('836927323370422273');

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
    FixRankRoles(users, memberid) {
        var _1 = this.guild.roles.cache.get("836943903055675412");
        var _2 = this.guild.roles.cache.get("836943964045049887");
        var _3 = this.guild.roles.cache.get("836944006809649163");
        var _4_10 = this.guild.roles.cache.get("837092842614423615");
        var _member = this.guild.members.cache.get(memberid);

        for (let i = 0; i<users.leaderBoard.length; i++) {
            if (users.leaderBoard[0][1] == _member.id) {
                if (!_member._roles.includes(_1.id)) {
                    _member.roles.remove(_2);
                    _member.roles.remove(_3);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_1); 
                }
                break;
            } 
            if (users.leaderBoard[1][1] == _member.id) {
                if (!_member._roles.includes(_2.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_3);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_2); 
                }
                break;
            }
            if (users.leaderBoard[2][1] == _member.id) {
                if (!_member._roles.includes(_3.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_2);
                    _member.roles.remove(_4_10);
                    _member.roles.add(_3); 
                }
                break;
            }
            if (i <= 10) if (users.leaderBoard[i][1] == _member.id) {
                if (!_member._roles.includes(_4_10.id)) {
                    _member.roles.remove(_1);
                    _member.roles.remove(_2);
                    _member.roles.remove(_3);
                    _member.roles.add(_4_10); 
                }
                break;
            }
            if (i > 10) if (users.leaderBoard[i][1] == _member.id) {
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
    Message(title, msg, color, message, shouldremove) {
        if (!color) color = "#9c1414";
        var sEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(msg)
            .setTimestamp()

        message.channel.send({ embeds: [sEmbed] }).then((sentEmbed) => {
            if (!shouldremove) return;
            setTimeout(() => {
                message.delete();
                sentEmbed.delete();
            }, 5000);
        });
    }
}
var server = new Server();

module.exports =  { server, Server };