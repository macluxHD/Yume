import "discord.js";
import { Collection, SlashCommandBuilder } from "discord.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<
      string,
      {
        data: SlashCommandBuilder;
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
      }
    >;
    cronJobs: { [guildId: string]: CronJob | null | undefined };
  }
}
