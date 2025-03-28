Contributions are welcome! Feel free to open issues or submit pull requests.

## Requirements

- Node.js v23.x (set with asdf in `.tool-versions`)

## File Structure

- **`src/commands/`**: Contains all slash commands.
- **`src/events/`**: Handles Discord events like `ready` and `interactionCreate`.
- **`src/schedule.ts`**: Core logic for fetching and sending anime schedules.
- **`src/db.ts`**: Database setup and migrations.
- **`src/deploy-commands.ts`**: Registers/updates slash commands with the discord application.

## Linting and Formatting

The project uses ESLint for linting.

## Build and Test

To run the bot in development copy the `.env.example` file to `.env` and fill in the required values.

To update the slash commands use (needed whenever you change the command structure and on the first run):

```bash
npm run refresh
```

To run the bot use:

```bash
npm run dev
```
