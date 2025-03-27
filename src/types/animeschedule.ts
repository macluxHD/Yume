export interface TimetableAnime {
  title: string;
  route: string;
  romaji: string;
  english: string;
  native: string;
  delayedText: string;
  delayedFrom: string;
  delayedUntil: string;
  status: "Finished" | "Ongoing" | "Delayed" | "Upcoming";
  episodeDate: string;
  episodeNumber: number;
  subtractedEpisodeNumber: number;
  episodes: number;
  lengthMin: number;
  donghua: boolean;
  airType: "raw" | "sub" | "dub";
  mediaTypes: Category[];
  imageVersionRoute: string;
  streams: Streams;
  airingStatus: "airing" | "aired" | "unaired" | "delayed-air";
}

export interface Anime {
  id: string;
  title: string;
  route: string;
  premier: string;
  subPremier: string;
  dubPremier: string;
  month: string;
  year: number;
  season: Season;
  delayedTimetable: string;
  delayedFrom: string;
  delayedUntil: string;
  subDelayedTimetable: string;
  subDelayedFrom: string;
  subDelayedUntil: string;
  dubDelayedTimetable: string;
  dubDelayedFrom: string;
  dubDelayedUntil: string;
  delayedDesc: string;
  jpnTime: string;
  subTime: string;
  dubTime: string;
  description: string;
  genres: Category[];
  studios: Category[];
  sources: Category[];
  mediaTypes: Category[];
  episodes: number;
  lengthMin: number;
  status: "Finished" | "Ongoing" | "Delayed";
  imageVersionRoute: string;
  stats: Stats;
  days: Days;
  names: Names;
  relations: Relations;
  websites: Websites;
}

export interface Category {
  name: string;
  route: string;
}

export interface Streams {
  crunchyroll: string;
  funimation: string;
  wakanim: string;
  amazon: string;
  hidive: string;
  hulu: string;
  youtube: string;
  netflix: string;
  apple: string;
}

export interface Season {
  title: string;
  year: number;
  season: "Winter" | "Spring" | "Summer" | "Fall";
  route: string;
}

export interface Stats {
  averageScore: number;
  ratingCount: number;
  trackedCount: number;
  trackedRating: number;
  colorLightMode: string;
  colorDarkMode: string;
}

export interface Days {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface Names {
  romaji: string;
  english: string;
  native: string;
  abbreviation: string;
  synonyms: string[];
}

export interface Relations {
  sequels: string[];
  prequels: string[];
  parents: string[];
  alternatives: string[];
  other: string[];
  sideStories: string[];
  spinoffs: string[];
}

export interface Websites {
  official: string;
  mal: string;
  aniList: string;
  kitsu: string;
  animePlanet: string;
  anidb: string;
  crunchyroll: string;
  funimation: string;
  wakanim: string;
  amazon: string;
  hidive: string;
  hulu: string;
  youtube: string;
  netflix: string;
  apple: string;
}
