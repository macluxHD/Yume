import { Client, Events } from "discord.js";
import db from "../db";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const dbGuilds = db.prepare(`SELECT id from guilds`).all() as {
      id: string;
    }[];
    const guildIds = dbGuilds.map((guild) => guild.id);
    const guilds = await client.guilds.fetch();

    guilds.forEach((guild) => {
      if (!guildIds.includes(guild.id)) {
        console.log(`Guild ${guild.id} not in db adding...`);

        db.prepare(`INSERT INTO guilds (id) VALUES (?)`).run(guild.id);
      }
    });
  },
};
