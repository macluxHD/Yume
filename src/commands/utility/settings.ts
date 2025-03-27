import {
  ChatInputCommandInteraction,
  InteractionResponse,
  MessageFlags,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

import { validateCronExpression } from "cron";
import db from "../../db";

const settingHandlers = {
  cron: cronHandler,
  list: listHandler,
};

export default {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Change settings")
    .addSubcommand((cmd) =>
      cmd
        .setName("cron")
        .setDescription("Settings related to automatic schedule posts")
        .addStringOption((opt) =>
          opt
            .setName("cron")
            .setDescription(
              "Crontab expression to determine when to send automatic schedule. See crontab.guru for more info"
            )
        )
        .addBooleanOption((opt) =>
          opt
            .setName("enabled")
            .setDescription("Wheter or not to send automatic schedules.")
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("list")
        .setDescription("Whitelist/Blacklist of animes")
        .addBooleanOption((opt) =>
          opt
            .setName("is_blacklist")
            .setDescription(
              "Wheter the list in the settings is used as a blacklist or a whitelist"
            )
        )
        .addStringOption((opt) =>
          opt
            .setName("add")
            .setDescription(
              "Comma seperated list of animes(anilist ids) to add to Whitelist/Blacklist"
            )
        )
        .addStringOption((opt) =>
          opt
            .setName("remove")
            .setDescription(
              "Comma seperated list of animes(anilist ids) to remove from Whitelist/Blacklist"
            )
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (
      !interaction.memberPermissions ||
      !interaction.memberPermissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({
        content: "You do not have the permission to execute this command",
        flags: MessageFlags.Ephemeral,
      });

    const subcommand =
      interaction.options.getSubcommand() as keyof typeof settingHandlers;

    const result = settingHandlers[subcommand](interaction);

    if (result) return result;

    interaction.reply({
      content: "Sucessfully changed settings",
      flags: MessageFlags.Ephemeral,
    });
  },
};

interface Update {
  query: string;
  params: unknown[];
}

type Updates = Update[];

const transaction = db.transaction((updates) => {
  if (updates.length <= 0) return;
  for (const update of updates) {
    db.prepare(update.query).run(...update.params);
  }
});

function cronHandler(
  interaction: ChatInputCommandInteraction
): null | Promise<InteractionResponse> {
  const cron = interaction.options.getString("cron");
  const enabled = interaction.options.getBoolean("enabled");

  const updates: Updates = [];

  if (cron) {
    if (!validateCronExpression(cron).valid)
      return interaction.reply({
        content:
          "Cron expression is not valid. Check https://crontab.guru/ to create a valid one.",
        flags: MessageFlags.Ephemeral,
      });

    updates.push({
      query: `UPDATE guilds SET schedule_crontab = ? WHERE id = ?`,
      params: [cron, interaction.guildId],
    });
  }

  if (enabled != null) {
    updates.push({
      query: `UPDATE guilds SET crontab_enabled = ? WHERE id = ?`,
      params: [enabled ? 1 : 0, interaction.guildId],
    });
  }

  transaction(updates);
  return null;
}

function listHandler(interaction: ChatInputCommandInteraction) {
  const isBlacklist = interaction.options.getBoolean("is_blacklist");
  const add = interaction.options.getString("add");
  const remove = interaction.options.getString("remove");

  const updates: Updates = [];

  if (isBlacklist != null) {
    updates.push({
      query: `UPDATE guilds SET is_blacklist = ? WHERE id = ?`,
      params: [isBlacklist ? 1 : 0, interaction.guildId],
    });
  }

  if (add) {
    if (!/^-?\d+(,-?\d+)*$/.test(add))
      interaction.reply({
        content:
          "Invalid Syntax only comma seperated lists of ids are allowed. Examples:\n`1234,3456,5468` `1234`",
        flags: MessageFlags.Ephemeral,
      });

    const anilist_ids = add.split(",");

    anilist_ids.forEach((id) => {
      updates.push({
        query: `INSERT OR IGNORE INTO anime_list (anilist_id, guild_id) VALUES (?, ?)`,
        params: [id, interaction.guildId],
      });
    });
  }

  if (remove) {
    if (!/^-?\d+(,-?\d+)*$/.test(remove))
      interaction.reply({
        content:
          "Invalid Syntax only comma seperated lists of ids are allowed. Examples:\n`1234,3456,5468` `1234`",
        flags: MessageFlags.Ephemeral,
      });

    const anilist_ids = remove.split(",");

    anilist_ids.forEach((id) => {
      updates.push({
        query: `DELETE FROM anime_list WHERE anilist_id = ? AND guild_id = ?`,
        params: [id, interaction.guildId],
      });
    });
  }

  transaction(updates);
  return null;
}
