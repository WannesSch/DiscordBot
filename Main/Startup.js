const Discord = require('discord.js');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http').createServer(app)

const { Intents, Collection } = require('discord.js');
const { Player } = require('discord-player');

const { UserRepository } = require('../Models/UserRepository.js');
const { User } = require('../Models/User.js');
const { Server } = require('../Models/Server.js');
const { GamesDb } = require('../Models/GamesDb.js');
const { Jobs } = require('../Models/Games/Assets/Jobs.js');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });

client.config = require('../Data/config');
client.commands = new Collection();

global.Server = new Server();
global.UserRepository = new UserRepository();
global.GamesDb = new GamesDb();
global.Jobs = new Jobs();
global.player = new Player(client, client.config.opt.discordPlayer);
global.config = client.config;

global.isInDevMode = global.config.settings.devmode;
global.developerId = global.config.settings.developerId;

client.login(client.config.app.token).then(client => { Startup(); });

app.use(express.static(path.join(__dirname, "../Website/public/")));
app.use(bodyParser.urlencoded({extended: true}));

async function Startup() { 
    global.UserRepository.InitializeAsync().then(() => {}); 
    global.Jobs.InitializeJobs();

    http.listen(global.config.website.port, () => {
        console.log('Listening at http://localhost:' + global.config.website.port);
    });
} 

// Only use to initialize discord users
async function InitializeDiscordUsersAsync() {
    let guild = client.guilds.cache.get("836756284795256893")

    for (let [id, GuildMember] of guild.members.cache) {
        let user = new User(GuildMember.user.id, GuildMember.user.username, 0, 0);
        console.log(await global.UserRepository.CreateAsync(user));
    }
}

['command_handler', 'event_handler'].forEach(handler => {
    require(`../Handlers/${handler}`)(client, Discord);
})

require('../src/events');


