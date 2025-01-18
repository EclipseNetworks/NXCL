// Load environment variables from the .env file
require('dotenv').config();

// Import necessary libraries
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

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

// PS99 Clan: Purge Role ID and Channel for !group command
const allowedRoleForPurge = '1329391050212507661'; // Role ID for !purge command
const ps99GroupUrl = 'https://nexinus.cloud/group'; // URL for the group

// Event that fires when the bot is ready and connected
client.once('ready', () => {
    console.log('PS99 Clan Bot is online!');
    // Set the bot's status to "Do Not Disturb" initially
    client.user.setStatus('dnd');

    // Array of status messages
    const statuses = [
        { message: 'Use code ttvleeroy in the item shop', type: ActivityType.Playing },
        { message: 'Join the PS99 group: !group', type: ActivityType.Listening }
    ];

    // Counter to rotate between statuses
    let currentStatus = 0;

    // Cycle status every 10 seconds
    setInterval(() => {
        client.user.setActivity(statuses[currentStatus].message, { type: statuses[currentStatus].type });
        // Move to the next status or loop back to the first one
        currentStatus = (currentStatus + 1) % statuses.length;
    }, 10000); // Change status every 10 seconds
});

// Event that fires when a message is received
client.on('messageCreate', async (message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // !group command to send the group link
    if (message.content === '!group') {
        message.channel.send(`You can join the group here: ${ps99GroupUrl}`);
    }

    // !purge command to delete all messages in the channel
    if (message.content === '!purge') {
        // Check if the user has the required role
        if (message.member.roles.cache.has(allowedRoleForPurge)) {
            try {
                // Fetch all messages in the channel
                const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });

                // Bulk delete messages
                await message.channel.bulkDelete(fetchedMessages);

                // Send a confirmation message
                message.channel.send('All messages have been deleted!');
            } catch (error) {
                console.error('Error deleting messages:', error);
                message.channel.send('There was an error trying to purge the messages.');
            }
        } else {
            // If the user doesn't have the required role, send an error message
            message.channel.send('You do not have permission to use this command.');
        }
    }

    // !help command to list available commands
    if (message.content === '!help') {
        message.channel.send(`
        **Available Commands:**
        - \`!group\` - Get the link to the PS99 group.
        - \`!purge\` - Purge all messages in the channel (only for those with the right role).
        `);
    }
});

// Log in to Discord with the bot's token
client.login(token);
