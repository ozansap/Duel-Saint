import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChatInputCommandInteraction, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { MOD_ROLE_ID } from "../config";
import { UserHandler } from "../utils/db";
import { Reply } from "../utils/reply";

const execute = async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getUser("player") ?? interaction.user;
    const userHandler = new UserHandler(user.id);
    const userData = await userHandler.fetch();
    const modRole = interaction.guild?.roles.resolve(MOD_ROLE_ID);

	const b_add = new ButtonBuilder().setLabel("Add").setStyle(ButtonStyle.Success).setCustomId("add");
	const b_remove = new ButtonBuilder().setLabel("Remove").setStyle(ButtonStyle.Danger).setCustomId("remove");
	const b_set = new ButtonBuilder().setLabel("Set").setStyle(ButtonStyle.Primary).setCustomId("set");

    const description = `${user}'s coins: ${userData.coins}`
    const reply = Reply.info(description);
	const message = await interaction.reply(reply.addComponents([b_add, b_remove, b_set]).ephemeral());

    const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 120000,
	});


	collector.on("collect", async (i) => {
        const input = new TextInputBuilder().setCustomId("amount").setLabel("Amount").setStyle(TextInputStyle.Short).setPlaceholder("Amount to be modified by/to. Whole numbers only.").setRequired(true);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        const modal = new ModalBuilder().setCustomId("modal").setTitle("Amount to be modified").addComponents(row);
        i.showModal(modal);

        const submit = await i.awaitModalSubmit({
            time: 60000,
        });
        
        let amount = await parseInt(submit.fields.getTextInputValue("amount"))

        if (submit && submit.isFromMessage() && Number.isInteger(amount)) {
            switch (i.customId) {
                case "add":
                    userHandler.coins_add(amount);
                    break;
                case "remove":
                    userHandler.coins_sub(amount);
                    break;
                case "set":
                    userHandler.coins_set(amount);
                    break;
            }

            await userHandler.update();
            let finalCoins = await userHandler.fetch().then(()=> userData.coins);

            const reply = Reply.info(
                `${user}'s Coins
                Action: ${i.customId}
                Amount: ${amount}
                Final Coins: ${finalCoins}
            `);

            submit.update(reply.removeComponents().ephemeral());
        } else if (submit && submit.isFromMessage()){
            const reply = Reply.error(`Whole numbers only, please.
                ${user}'s Coins: ${userData.coins}
            `);

            submit.update(reply.ephemeral())
        }
    })
}

module.exports = {
	execute,
	data: new SlashCommandBuilder()
		.setName("coins")
		.setDescription("View a user's coin amount")
        .addUserOption((o) => o.setName("player").setDescription("The player you want to view coins of").setRequired(false))
};