import { Events, ActivityType } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: { user: { setPresence: any, tag: string }, presence: { status: string  }; }) {
		console.log(`[Ready] Logged in as ${client.user.tag}`);

		client.user.setPresence({
			status: 'idle',
            activities: [{
                name: `Add your `,
                type: ActivityType.Playing
            }],
		});

	},
};