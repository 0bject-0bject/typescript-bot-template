require('dotenv').config();
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

const commands = [];

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

for (const file of fs.readdirSync(path.resolve(__dirname, "commands")).filter(file => file.endsWith('.js'))) {
    try {
        const command = require(path.resolve(__dirname, "commands", file));
        commands.push(command.data.toJSON());
    } catch (error) {
        console.error(`Error loading command file ${file}: ${error}`);
    }
}

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
        { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);

} catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
}