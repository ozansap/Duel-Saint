import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserHandler } from "../utils/db";
import { Reply } from "../utils/reply";

const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser("player") ?? interaction.user;
    
    const subcommand = interaction.options.getSubcommand(true);
    const amount = interaction.options.getInteger("amount", true)

    const userHandler = new UserHandler(user.id);
    const userData = await userHandler.fetch();

    const coins_previous = userData.coins;

// fix this

    let coins_current = userData.coins;
    let message = ``

    switch (subcommand) {
		case "add":
			userHandler.coins_add(amount);
            coins_current = coins_previous + amount
			break;
		case "subtract":
			userHandler.coins_sub(amount);
            coins_current = (coins_previous - amount >= 0) ? coins_previous - amount : 0
			break;
		case "set":
			userHandler.coins_set(amount);
            coins_current = amount;
			break;
	}

    userHandler.update();

    const reply = Reply.success(`You have modified ${user}'s coins from **${coins_previous}** to **${coins_current}**.`)
	interaction.reply(reply.visible());

}

module.exports = {
	execute,
	data: new SlashCommandBuilder()
		.setName("modcoins")
        .addUserOption((o) => o.setName("player").setDescription("The player you want to add coins to").setRequired(false))
		.setDescription("View or modify a user's coin amount")
        .addSubcommand((sc) =>
            sc
                .setName("add")
                .setDescription("Add coins to a user")
                .addIntegerOption((o) => o.setName('amount').setDescription("Amount of coins to be added").setRequired(true)))
        .addSubcommand((sc) =>
            sc
                .setName("subtract")
                .setDescription("Remove coins from a user")
                .addIntegerOption((o) => o.setName('amount').setDescription("Amount of coins to be removed").setRequired(true)))
        .addSubcommand((sc) =>
            sc
                .setName("set")
                .setDescription("Set a user's coins")
                .addIntegerOption((o) => o.setName('amount').setDescription("Amount of coins to be set to").setRequired(true)))
};