import { EmbedBuilder, TextChannel } from "discord.js";
import moment from "moment";
import client from "./main";

export async function getSchedule(date: moment.Moment = moment()) {
  const query = new URLSearchParams({
    week: date.isoWeek().toString(),
    year: date.year().toString(),
    tz: "Etc/UTC",
  });
  const res = await fetch(
    "https://animeschedule.net/api/v3/timetables/sub?" + query,
    {
      headers: {
        Authorization: `Bearer ${process.env.ANIME_SCHEDULE_API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch schedule: ${res.statusText}`);
  }

  let data = (await res.json()) as TimetableAnime[];

  // filter out animes that air today
  data = data.filter(
    (anime) =>
      moment(anime.episodeDate).utc().dayOfYear() == date.utc().dayOfYear()
  );

  return data;
}

export async function sendAnimeEmbed(
  channelId: string,
  animes: TimetableAnime[]
) {
  const channel = (await client.channels.fetch(
    channelId
  )) as TextChannel | null;

  if (!channel) {
    throw new Error("Cannot find given channel");
  }

  animes.forEach((anime) => {
    const embed = new EmbedBuilder()
      .setTitle(anime.title)
      .setThumbnail(
        "https://img.animeschedule.net/production/assets/public/img/" +
          anime.imageVersionRoute
      )
      .addFields(
        {
          name: "Episode",
          value: anime.episodes
            ? `${anime.episodeNumber}/${anime.episodes}`
            : anime.episodeNumber.toString(),
        },
        {
          name: "Air time",
          value: `<t:${moment(anime.episodeDate).unix()}:R>`,
        }
      )
      .setFooter({ text: "Powered by animeschedule.net" })
      .setColor("#00b0f4");

    channel.send({ embeds: [embed] });
  });
}
