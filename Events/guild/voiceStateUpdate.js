module.exports = (Discord, client, oldMember, newMember) => {
    HandleVoiceUpdate(newMember);
}

async function HandleVoiceUpdate(member) {
    let user = await global.UserRepository.GetAsync(member.id)
    if (user == null) return;
    // if user isn't muted or deafend 
    if (!member.selfDeaf && !member.selfMute && !member.suppress && member.channelId) {
        if (member.streaming || member.selfVideo) {
            global.Server.Message(null, "**" + user.userName + "** Is streaming / using camera", "#60a339", global.Server.eventChannel, false);
            user.isInVoice = false;
            setTimeout(() => {user.isInVoice = true; user.StartCounting(1.25);}, 1000);
        } 
        else  {
            global.Server.Message(null, "**" + user.userName + "** Joined a channel or unmuted", "#60a339", global.Server.eventChannel, false);
            user.isInVoice = false;
            setTimeout(() => {user.isInVoice = true; user.StartCounting(1);}, 1000);
        }
    }
    else { 
        global.Server.Message(null, "**" + user.userName + "** left a channel or is muted", "#eb5534", global.Server.eventChannel, false);
        user.isInVoice = false;
    }
}