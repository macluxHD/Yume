# Yume - Discord Anime Schedule Bot

Yume is a Discord bot designed to display the schedule of airing anime. It fetches data from AnimeSchedule.net and provides users with up-to-date information about air times.

## Features

- Fetches anime schedules for the current day or specific days of the week.
- Sends automated schedule updates to designated channels using cron jobs.
- Allows server administrators to manage anime whitelist/blacklist for schedule filtering.
- Provides anilist links for each anime in the schedule.

## Prerequisites

Before setting up the bot, ensure you have the following:

- **Docker**: Install Docker on your machine. Follow the instructions on the [Docker website](https://docs.docker.com/get-docker/) for your operating system.
- **Docker Compose**: Install Docker Compose. You can find installation instructions on the [Docker Compose website](https://docs.docker.com/compose/install/).
- **Discord Bot Token**: Create an application on the [Discord Developer Portal](https://discord.com/developers/applications).
- **Discord Application ID**: The application ID of your Discord application.
- **AnimeSchedule API Token**: Obtain an API token from [AnimeSchedule.net](https://animeschedule.net/).

## Setup Instructions

### 1. Download the compose.yaml file

Download the `docker-compose.yaml` file from the repository. This file contains the configuration for Docker Compose, which will help you set up the bot in a containerized environment.

### 2. Configure Environment Variables

Open the compose.yaml file and set the following environment variables:

```yaml
environment:
  - DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
  - DISCORD_BOT_CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
  - ANIME_SCHEDULE_API_TOKEN=YOUR_ANIMESCHEDULE_API_TOKEN
```

### 3. (Optional) Change the database path location

If you want to change the location of the SQLite database, modify the volume path in the `docker-compose.yaml` file. Change the `./data` path to your desired location:

Default:

```yaml
volumes:
  - ./data:/app/data
```

Custom:

```yaml
volumes:
  - /path/to/your/custom/location:/app/data
```

### 4. Start the Bot

Run the following command to start the bot using Docker Compose:

```bash
docker compose up -d
```

This command will build the Docker image and start the bot in detached mode.

To stop the bot, use:

```bash
docker compose down
```

### 5. Verify the Bot is Running

To check if the bot is running, use the following command:

```bash
docker compose logs -f
```

This command will display the logs from the bot container. Look for messages indicating that the bot has successfully connected to Discord.

### 6. Invite the Bot to Your Server

Use the following URL to invite the bot to your Discord server. Replace `YOUR_APPLICATION_ID` with your bot's client ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=8&scope=bot%20applications.commands
```

## Discord automatic schedule posting setup

To set up automatic schedule posting, you need to configure the bot to send messages to a specific channel at regular intervals. This can be done using the `/settings schedules` command in Discord.

- **cron**: The cron option defines when the bot will post the schedule. For more information on cron syntax, refer to the [crontab.guru](https://crontab.guru/) website.
- **enable**: The enable option allows you to enable or disable the schedule posting feature. Set it to `true` to enable automatic posting.
- **channel**: The channel option specifies the Discord channel where the schedule will be posted.

## Commands

### `/ping`

Replies with "Pong!" to test if the bot is online.

### `/schedule`

Displays the anime schedule for a specific day of the week.

### `/settings`

Allows administrators to configure bot settings, such as schedule posting times and anime whitelist/blacklist.
