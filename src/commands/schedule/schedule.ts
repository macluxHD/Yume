import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { getSchedule, sendAnimeEmbed } from "../../schedule";
import moment from "moment";

export default {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Shows the anime schedule of the given day")
    .addStringOption((option) =>
      option
        .setName("weekday")
        .setDescription(
          "The weekday of the current week to show the schedule for"
        )
        .setRequired(true)
        .addChoices(
          { name: "Today", value: "today" },
          { name: "Sunday", value: "0" },
          { name: "Monday", value: "1" },
          { name: "Tuesday", value: "2" },
          { name: "Wednesday", value: "3" },
          { name: "Thursday", value: "4" },
          { name: "Friday", value: "5" },
          { name: "Saturday", value: "6" }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    let weekday = interaction.options.getString("weekday") as string;

    if (!interaction.guild)
      return interaction.reply("This command can only be used in a server");

    if (weekday == "today") weekday = moment.utc().weekday().toString();

    sendAnimeEmbed(
      interaction.channelId,
      await getSchedule(
        moment().utc().weekday(Number.parseInt(weekday)),
        interaction.guild
      )
    );

    interaction.reply({
      content: "Sending schedule",
      flags: MessageFlags.Ephemeral,
    });
  },
};
