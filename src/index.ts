import { Client, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

interface Command {
    data: {
        name: string;
        description: string;
        options?: any[];
    };
    execute: (...args: any[]) => void;
}

const client = new Client({
    intents: [
        /*Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES*/
    ],
    allowedMentions: { parse: ["users", "roles"] }
});

client.commands = new Collection<string, Command>();

// Load all commands
for (const file of fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith('.js'))) {
    const command: Command = require(path.join(__dirname, "commands", file));

    // Check if the command has the required properties 
    if (!command.data || !command.execute) {
        console.log(`[WARNING] The command at ${path.join(__dirname, "commands", file)} is missing a required "data" or "execute" property.`);

        continue;
    };

    client.commands.set(command.data.name, command);
}

// Load all events
for (const file of fs.readdirSync(path.join(__dirname, "events")).filter(file => file.endsWith('.js'))) {
    const event = require(path.join(__dirname, "events", file));

    if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
    };
};

// Import dotenv, and use it to login to mongo/discord!
require('dotenv').config();
client.login(process.env.TOKEN);

mongoose.connect(process.env.MONGO_URI as string).then(() => console.log("Connected to MongoDB"));

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>;
    }
}