// Load environment variables from the .env file
require('dotenv').config();

// Import Discord.js library
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ]
});

// Get the token from environment variables
const token = process.env.DISCORD_TOKEN;

// Event that fires when the bot is ready and connected
client.once('ready', () => {
    console.log('PS99 Clan Bot is online!');
});

// Event that fires when a message is received
client.on('messageCreate', message => {
    if (message.content === '!help') {
        message.channel.send('Here are the commands you can use: !stats, !events, !members');
    }
    
    if (message.content === '!stats') {
        message.channel.send('PS99 Clan Stats: Active members: 42, Upcoming Events: 2');
    }

    if (message.content === '!events') {
        message.channel.send('Upcoming Events: 1. Clan Tournament - Date: 2025-01-30');
    }

    if (message.content === '!members') {
        // Example: Display all online members in your server
        const onlineMembers = message.guild.members.cache.filter(member => member.presence?.status === 'online').map(member => member.user.tag);
        message.channel.send(`Online members: ${onlineMembers.join(', ')}`);
    }
});

// Log in to Discord with the bot's token
client.login(token);
