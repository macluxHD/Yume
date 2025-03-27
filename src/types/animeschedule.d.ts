interface TimetableAnime {
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

interface Category {
  name: string;
  route: string;
}

interface Streams {
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
