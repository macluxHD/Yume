import { Events, Guild } from "discord.js";
import db from "../db";

export default {
  name: Events.GuildCreate,
  async execute(guild: Guild) {
    console.log(`Joined guild: ${guild.name}`);

    const guildExists = db
      .prepare("SELECT * FROM guilds WHERE id = ?")
      .get(guild.id) as string;

    if (guildExists) {
      return;
    }

    db.prepare("INSERT INTO guilds (id) VALUES (?)").run(guild.id);
  },
};
