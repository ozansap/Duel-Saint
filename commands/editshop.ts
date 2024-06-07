import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ChatInputCommandInteraction, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { PrizeHandler, Shop } from "../utils/db";
import { Reply } from "../utils/reply";

const execute = async (interaction: ChatInputCommandInteraction) => {
    const shop = new Shop();
    const prizeHandler = new PrizeHandler();

	const b_add = new ButtonBuilder().setLabel("Add").setStyle(ButtonStyle.Success).setCustomId("add");
	const b_remove = new ButtonBuilder().setLabel("Remove").setStyle(ButtonStyle.Danger).setCustomId("remove");
	const b_edit = new ButtonBuilder().setLabel("Edit").setStyle(ButtonStyle.Primary).setCustomId("edit");

    const prizeList = await shop.fetch();
    const description = prizeList.map(i => `${i.name}: ${i.value}`).join('\n')
    const title = `Edit Prizes`
    const reply = new Reply( {title, description} );

	const message = await interaction.reply(reply.addComponents([b_add, b_remove, b_edit]).ephemeral());

    const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 120000,
	});


	// collector.on("collect", async (i) => {
    //     const input = new TextInputBuilder().setCustomId("amount").setLabel("Amount").setStyle(TextInputStyle.Short).setPlaceholder("Amount to be modified by/to. Whole numbers only.").setRequired(true);
    //     const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    //     const modal = new ModalBuilder().setCustomId("modal").setTitle("Amount to be modified").addComponents(row);
    //     i.showModal(modal);

    //     const submit = await i.awaitModalSubmit({
    //         time: 60000,
    //     });
        
    //     let amount = await parseInt(submit.fields.getTextInputValue("amount"))

    //     if (submit && submit.isFromMessage() && Number.isInteger(amount)) {
    //         switch (i.customId) {
    //             case "add":
    //                 // userHandler.coins_add(amount);
    //                 break;
    //             case "remove":
    //                 // userHandler.coins_sub(amount);
    //                 break;
    //             case "set":
    //                 // userHandler.coins_set(amount);
    //                 break;
    //         }

    //         // await prizeHandler.update();
    //         // let finalCoins = await userHandler.fetch().then(()=> userData.coins);

    //         const reply = Reply.info(
    //             `blah blah`
    //         );

    //         submit.update(reply.removeComponents().ephemeral());
    //     } else if (submit && submit.isFromMessage()){
    //         const reply = Reply.error(`
    //             uh oh
    //         `);

    //         submit.update(reply.ephemeral())
    //     }
    // })
}

module.exports = {
	execute,
	data: new SlashCommandBuilder()
		.setName("editshop")
		.setDescription("View/edit the shop")
        .setDefaultMemberPermissions(2)
};