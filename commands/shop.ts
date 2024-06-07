import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserHandler, Shop, PrizeHandler } from "../utils/db";
import { Reply } from "../utils/reply";
import { PrizeData } from "../utils/types";

const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.user;

	const userHandler = new UserHandler(user.id);
	const userData = await userHandler.fetch();

	const shop = new Shop()
	const prizeList = await shop.fetch()
	
    const title = `Prize Shop`
	const description = prizeList.map(i => `${i.name}: ${i.value}`).join('\n') + `Coins: **${userData.coins}**`
	const reply = new Reply( { title, description } )
	interaction.reply(reply.ephemeral());
};

module.exports = {
	execute,
	data: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("See the available list of prizes in the shop")
};