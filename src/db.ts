import Database from "better-sqlite3";

const db = new Database(process.cwd() + "/data/" + "db.sqlite");

const userVersion = db.pragma("user_version", { simple: true }) as number;
const newestVersion = 1;

// Migration code
for (let i = userVersion; i < newestVersion; i++) {
  switch (userVersion) {
    // Special case this will always create the newest version
    case 0:
      // Note that this may cause issues in the future: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
      db.pragma("journal_mode = WAL");
      db.pragma("user_version = " + newestVersion);

      db.prepare(
        `
      CREATE TABLE IF NOT EXISTS guilds (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
      ).run();

      i = newestVersion;
      break;
  }
}

export default db;

process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
