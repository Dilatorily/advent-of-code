# advent-of-code

Repository for my solutions for [Advent of Code](https://adventofcode.com).

## Prerequisites

- [Node.js](https://nodejs.org/) (with npm)

## Authentication

### Automated Login with Bitwarden (Recommended)

**Prerequisites:**

- GitHub credentials stored in Bitwarden (with TOTP if 2FA is enabled)
- Bitwarden API key ([learn how to obtain one](https://bitwarden.com/help/personal-api-key/))

**Setup:**

1. Install dependencies (includes Bitwarden CLI):

   ```bash
   npm install
   ```

2. Get your session cookie:
   - **Automated**: Run `npm run login` - it will prompt for your Bitwarden configuration and automatically create the `.env` file
   - **Manual**: Log in to [Advent of Code](https://adventofcode.com) in your browser, find the `session` cookie in developer tools, and save it to a file named `.session` in the project root

**What happens during login:**

- Prompts for your Bitwarden master password (never saved to disk)
- Unlocks your Bitwarden vault
- Finds your GitHub credentials (by URL: github.com)
- Logs in to GitHub via Puppeteer browser automation
- Handles 2FA automatically using Bitwarden's TOTP generator
- Saves the Advent of Code session cookie to `.session`

**Security Note:** Your Bitwarden master password is never stored in `.env` or any file. It's always prompted interactively for security.

**Troubleshooting:**

- **"Bitwarden CLI not found"**: Run `npm install` to ensure all dependencies are installed
- **"Invalid master password"**: Ensure you're entering the correct password for your Bitwarden vault
- **Login timeout**: Increase timeouts in `scripts/login.js` if your network is slow
- **Self-hosted Bitwarden**: Make sure `BITWARDEN_SERVER_URL` in `.env` points to your instance

## Usage

Once authenticated, you can:

1. Execute `npm start -- --date=yyyy-mm-dd` to create the scaffold for the specified date
2. Execute `npm start -- --date=yyyy-mm-dd --part [1|2]` to execute the code for the specified date for the specified part
