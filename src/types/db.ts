export interface dbGuild {
  id: string;
  schedule_crontab: string;
  crontab_enabled: boolean;
  is_blacklist: boolean;
  schedule_channel: string;
  created_at: string;
}

export interface animeList {
  guild_id: string;
  anilist_id: string;
  created_at: string;
}

export interface animeCache {
  id: string;
  route: string;
  anilist_id: string;
  created_at?: string;
  updated_at?: string;
}
