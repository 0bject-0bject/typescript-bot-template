import { Interaction } from 'discord.js';
import memberSchema from '../models/member';

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        // Get the command from the collection
        const command = interaction.client.commands.get(interaction.commandName);

        // If the command doesn't exist, return
        if (!command) return;

        const data: any = await memberSchema.findOne({ id: interaction.user.id });

        if (!data) {
            new memberSchema({
                id: interaction.user.id,
                xp: 0,
                level: 0
            }).save();
        };

        // ADD YOUR XP AND LEVEL SYSTEM HERE!!!

        try {

            await command.execute(interaction);

        } catch (error) {
            console.error(error);

            if (interaction.deferred || interaction.replied) return;

            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};

interface member {
    id: string;
    xp: number;
    level: number;
};