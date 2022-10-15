const { MessageEmbed } = require('discord.js');

class User {
    constructor(_discordId, _userName, _rank, _experience, _coins, _bank, _lastDailyClaim, _lastWork) {
        this.discordId = _discordId;
        this.userName = _userName;
        this.rank = _rank;
        this.experience = _experience;
        this.requiredExperience = parseInt(350 * (this.rank + 1) * (1 + (this.rank + 1)));
        this.hasChatTimeout = false;
        this.isInVoice = false;
        this.inVoiceCount = 0;
        this.isCounting = false;
        this.coins = _coins;
        this.bank = _bank;
        this.lastDailyClaim = _lastDailyClaim;
        this.lastWork = _lastWork;
        this.thread = null;
    }

    async StartCounting(multiplier) {
        while (true) {
            if (!this.isInVoice) {
                await this.AddExperienceToUser(null, true, this, multiplier);
                this.inVoiceCount = 0;
                break;
            }
            await sleep(1000).then(() => { this.inVoiceCount++;});
            if (this.inVoiceCount == 3600) {
                global.Server.Message(null, "Updated experience of **" + this.userName + "** after sitting in a voice channel for 1 hour.", "#3953a3", global.Server.eventChannel, false)
                await this.AddExperienceToUser(null, true, this, multiplier);
                this.inVoiceCount = 0;
            }
        }
    }

    async AddExperienceToUser(message, isInVoiceCall, multiplier) {
        if (!multiplier) multiplier = 1;
        if (message && this.hasChatTimeout == false && message.author.id != global.Server.previousMessageAuthorId) {
            if (message.content.indexOf("https") >= 0) return;
            let messageArr = message.content.split(' ')
            messageArr = messageArr.filter((item, index) => messageArr.indexOf(item) === index);
            this.experience += parseInt((messageArr.length * 5 + 5));
            this.hasChatTimeout = true;
            global.Server.previousMessageAuthorId = message.author.id;

            setTimeout(() => { this.hasChatTimeout = false; }, 3000);
        }
        if (isInVoiceCall) this.experience += Math.floor(this.inVoiceCount / 8);
        await this.CheckUserRank(message).then(async () => { await global.UserRepository.UpdateAsync(); });
    }

    async CheckUserRank(message) {
        global.UserRepository.UpdateLeaderboardAsync();
        global.Server.FixRankRolesAsync(this.discordId)
        if (this.experience >= this.requiredExperience) {
            this.rank++;
            this.coins += 2000;
            this.requiredExperience = parseInt(350 * (this.rank + 1) * (1 + (this.rank + 1)))

            var sEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle("Rankup")
                .setDescription(`${this.userName} has ranked up to **#${this.rank}**\nYou've received **2000** coins.\nExperience required for next rank: **${this.requiredExperience}**`)
                .setTimestamp()
            if (message != null) {message.channel.send({ embeds: [sEmbed] }); return;}
            global.Server.rankupChannel.send({ embeds: [sEmbed] });
        }
        return this;
    }

    async GetThread(channel) {
        if (this.thread == null) {
            const thread = await channel.threads.create({
                name: `${this.userName} Gambling`,
                autoArchiveDuration: 60,
                reason: `Gamble thread created by ${this.userName}`,
            });

            this.thread = thread;
            await this.thread.members.add(this.discordId);
        }

        return this.thread;
    }
}

const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))}

module.exports = { User };