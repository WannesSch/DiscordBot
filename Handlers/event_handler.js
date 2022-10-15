const fs = require('fs');

module.exports = (client, Discord, scrims) => {
    const load_dir = (dirs) => {
        var event_files = fs.readdirSync(`../Events/${dirs}`).filter(file => file.endsWith('.js'));

        event_files.forEach(file => {
            var event = require(`../Events/${dirs}/${file}`);
            var event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, Discord, client));
        })
    }

    ['client', 'guild'].forEach(e => load_dir(e))
}