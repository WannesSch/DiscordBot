const fs = require('fs');
const { MessageEmbed } = require('discord.js');
var { server } = require('./Server.js')

class Users {
    constructor(server) {
        this.userList = [];
        this.leaderBoard = [];
        this.server = server;
    }
    async InitUsers() {
        var seenNames = {};
        var userArr = await JSON.parse(fs.readFileSync('../Data/Users.json'));
        userArr = userArr.filter(function(currentObject) {
            if (currentObject.name in seenNames) {
                return false;
            } else {
                seenNames[currentObject.name] = true;
                return true;
            }
        });
        this.userList = [];
        userArr.forEach(_user => {
            var user = new User(
                _user.name, 
                _user.discordid, 
                _user.steamid, 
                _user.rank, 
                _user.experience, 
                _user.coins, 
                _user.bank, 
                _user.lastDaily, 
                _user.isShopping
            );
            this.userList.push(user);

            user.UpdateRank(null);
        });
        this.UpdateLeaderboard();
    }
    AddUser(user) {this.userList.push(user);}
    FindUserByName(name) {
        var user = null;
        for (let i = 0; i<this.userList.length; i++) {
            if (this.userList[i].name == name) user = this.userList[i];
        }
        return user;
    }
    FindUserByDiscordID(discordID) {
        var user = null;
        for (let i = 0; i<this.userList.length; i++) {
            if (this.userList[i].discordid == discordID) user = this.userList[i];
        }
        return user;
    }
    FindUserRankOnLeaderboard(name) {
        var index = 0;
        for (let i = 0; i<this.leaderBoard.length; i++) {
            if (this.leaderBoard[i][0] == name) index = (i += 1);
        }
        return index;
    }
    UpdateLeaderboard() {
        var userRankArr = [];
        for (let i = 0; i<this.userList.length; i++) {
            userRankArr.push([this.userList[i].name, this.userList[i].discordid, this.userList[i].rank, this.userList[i].experience]);
        }
        
        userRankArr = userRankArr.sort(function(a,b) {
            return b[3] - a[3];
        });

        this.leaderBoard = userRankArr;
    }
    CheckIfExists(member) {
        var user = null;
        for (let i = 0; i<this.userList.length; i++) {
            if (this.userList[i].discordid == member.id) user = this.userList[i];
        }

        if (user != null) return true;
        var user = new User(member.displayName, member.id, "", "0", "0");
        this.userList.push(user);
        return false;
    }
    ReadJSON() {

    }
    UpdateJSON() {
        let data = JSON.stringify(this.userList);
        fs.writeFileSync('../Data/Users.json', data);
        this.InitUsers();
    }
}
class User {
    constructor(name, discordid, steamid, rank, experience, coins, bank, lastDaily, isShopping) {
        this.name = name;
        this.discordid = discordid;
        this.steamid = steamid;
        this.rank = parseInt(rank);
        this.experience = parseInt(experience);
        this.hasTimout = false;
        this.requiredXP = 0;
        this.isInVoiceCall = false;
        this.isInVoiceCallCount = 0;
    }
    UpdateRank(msg) {
        this.GetRequiredXP();

        if (this.experience >= this.requiredXP) {
            this.rank++;
            if(msg == null) return;
            this.GetRequiredXP()

            var sEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle("Rankup")
                .setDescription(this.name + " has ranked up to #" + this.rank +"\nExperience required for next rank: " + this.requiredXP)
                .setTimestamp()
            
            if (msg != null) {msg.channel.send({ embeds: [sEmbed] }); return;}
            server.mainChannel.send({ embeds: [sEmbed] });
        }
    }
    GetRequiredXP() {
        this.requiredXP = 0;
        var nextRank = this.rank + 1;
        //Arithmetic Progression
        this.requiredXP = 250 * nextRank * (1 + nextRank);
    }
    UpdateXP(msg, invoicecall, users) {
        if (users.server.previousMessage != null) {
            //if (this.discordid == users.server.previousMessage.author.id) {users.server.previousMessage = msg; return;}
            if (msg == users.server.previousMessage.content && this.discordid == users.server.previousMessage.author.id) return;
        }
        if (this.hasTimout) return;

        users.server.previousMessage = msg;

        this.hasTimout = true;
        setTimeout(() => {this.hasTimout = false;}, 5 * 1000);
        if (msg) {
            let msgLength = new Set(msg.content).size;
            if (msgLength < 10) this.experience += 30;
            if (msgLength < 35 && msgLength > 10) this.experience += 60;
            if (msgLength > 35 && msgLength < 60)  this.experience += 100;
            if (msgLength > 60)  this.experience += 150;
    
            var extraPointArr = ["nigger", "nigga", "peppah", "gay", "retaar", "bitch", "bastard", "retard", "dick", "rtr", "migger", "ass", "kasse", "jwakkes"];
            
            for (let i = 0; i<extraPointArr.length; i++) 
                if (msg.content.toLowerCase().indexOf(extraPointArr[i]) >= 0) this.experience += msgLength * 2;
        }
        else if (invoicecall) this.experience += Math.floor(this.isInVoiceCallCount / 8);

        this.UpdateRank(msg);
        users.UpdateLeaderboard();
        users.UpdateJSON();
        server.FixRankRoles(users, this.discordid);
    }
    async StartCounting() {
        while (true) {
            if (!this.isInVoiceCall) {
                this.UpdateXP(null, true, users);
                this.isInVoiceCallCount = 0;
                break;
            }
            await sleep(1000).then(() => {this.isInVoiceCallCount++;});
            if (this.isInVoiceCallCount == 3600) {
                this.UpdateXP(null, true, users);
                this.isInVoiceCallCount = 0;
            }
        }
    }
}

const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))}


module.exports = { User, Users }