import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import moment from "moment";
import client from "./main";
import db from "./db";
import { Anime, TimetableAnime } from "./types/animeschedule";
import { animeCache, animeList, dbGuild } from "./types/db";

export async function getSchedule(
  date: moment.Moment = moment(),
  guild: Guild
) {
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
    throw new Error(`Failed to fetch schedule`);
  }

  let data = (await res.json()) as TimetableAnime[];

  // filter out animes that air today
  data = data.filter(
    (anime) =>
      moment(anime.episodeDate).utc().dayOfYear() == date.utc().dayOfYear()
  );

  // filter out animes based on whitelist/blacklist
  const list = db
    .prepare(`SELECT * FROM anime_list WHERE guild_id = ?`)
    .all(guild.id) as animeList[];
  const dbGuild = db
    .prepare(`SELECT * FROM guilds WHERE id = ?`)
    .get(guild.id) as dbGuild;
  if (list.length > 0) {
    const filteredAnime = [];
    for (const anime of data) {
      const additionalData = (await getAdditionalAnimeData(
        anime.route
      )) as animeCache;

      const found = list.some((a) => a.anilist_id == additionalData.anilist_id);

      if (dbGuild.is_blacklist) {
        if (!found) filteredAnime.push(anime);
      } else {
        if (found) filteredAnime.push(anime);
      }
    }
    data = filteredAnime;
  }

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

  for (const anime of animes) {
    const additionalData = await getAdditionalAnimeData(anime.route);

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

    embed.setURL("https://anilist.co/anime/" + additionalData.anilist_id);
    embed.setAuthor({ name: additionalData.anilist_id });

    await channel.send({ embeds: [embed] });
  }
}

async function getAdditionalAnimeData(
  animeRoute: TimetableAnime["route"]
): Promise<animeCache> {
  const cacheTime = moment().subtract(1, "months").unix();
  const cache = db
    .prepare(
      `SELECT * FROM anime_cache WHERE route = ? AND Datetime(updated_at) >= Datetime(?, 'unixepoch')`
    )
    .get(animeRoute, cacheTime) as animeCache;

  if (cache) return cache;

  const res = await fetch(
    "https://animeschedule.net/api/v3/anime/" + animeRoute,
    {
      headers: {
        Authorization: `Bearer ${process.env.ANIME_SCHEDULE_API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch anime`);
  }

  const data = (await res.json()) as Anime;

  const new_cache: animeCache = {
    id: data.id,
    route: data.route,
    anilist_id: data.websites.aniList.match(/\/anime\/(\d+)/)?.[1] as string,
  };

  db.prepare(
    `
    INSERT OR IGNORE INTO anime_cache (id, route, anilist_id) VALUES (?, ?, ?)
    `
  ).run(...Object.values(new_cache));

  db.prepare(
    `
    UPDATE anime_cache SET id = ?, route = ?, anilist_id = ? WHERE route = ?
    `
  ).run(...Object.values(new_cache), animeRoute);

  return new_cache;
}
