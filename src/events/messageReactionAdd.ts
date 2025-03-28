import {
  Events,
  MessageReaction,
  MessageReactionEventDetails,
  User,
} from "discord.js";
import db from "../db.js";

export default {
  name: Events.MessageReactionAdd,
  async execute(
    messageReaction: MessageReaction,
    _user: User,
    _details: MessageReactionEventDetails
  ) {
    let { message } = messageReaction;
    const { emoji } = messageReaction;

    if (emoji.name !== "❌") return;

    // Fetch full message if partial, as partials do not have the embed
    if (message.partial) {
      try {
        message = await message.fetch();
      } catch (error) {
        console.log("Something went wrong when fetching the message: ", error);
        return;
      }
    }

    if (!message.embeds[0].author) return;

    const anilist_id = Number.parseInt(message.embeds[0].author.name);

    if (isNaN(anilist_id)) return;

    db.prepare(
      `INSERT OR IGNORE INTO anime_list (anilist_id, guild_id) VALUES (?, ?)`
    ).run(message.embeds[0].author.name, message.guildId);
  },
};
