import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserHandler } from "../utils/db";
import { Reply } from "../utils/reply";

const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.user;

	const userHandler = new UserHandler(user.id);
	const userData = await userHandler.fetch();

    const title = `Prince Shop`
    const description = `nothing yet KEKW\n\n` + `Coins: **${userData.coins}**`
    // add button builder to redeem
    // chain?

	const reply = new Reply( { title, description } )
	interaction.reply(reply.ephemeral());
};

module.exports = {
	execute,
	data: new SlashCommandBuilder()
		.setName("prizes")
		.setDescription("See the available list of prizes")
};