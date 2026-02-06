# advent-of-code

Repository for my solutions for [Advent of Code](https://adventofcode.com).

## Prerequisites

- [Node.js](https://nodejs.org/) (with npm)

## Authentication

### Option 1: Automated Login with Bitwarden (Recommended)

If you have GitHub credentials stored in Bitwarden:

**Prerequisites:**

- GitHub credentials stored in Bitwarden (with TOTP if 2FA is enabled)
- Bitwarden API key ([learn how to obtain one](https://bitwarden.com/help/personal-api-key/))

Note: Bitwarden CLI will be automatically installed by the script if not present.

**Setup:**

Run the interactive setup:

```bash
npm run login
```

This will:

1. Install Bitwarden CLI if not present
2. Prompt for your Bitwarden server URL (supports self-hosted instances)
3. Ask for your API Key credentials (Client ID and Client Secret)
4. Store configuration in `.env` for future use

**Usage:**

Execute `npm run login` to authenticate with Advent of Code. This will:

- Unlock your Bitwarden vault
- Find your GitHub credentials (by URL: github.com)
- Log in to GitHub via Puppeteer browser automation
- Handle 2FA automatically using Bitwarden's TOTP generator
- Save the Advent of Code session cookie to `.session`

### Option 2: Manual Session Cookie

If you don't use Bitwarden, you can manually provide your session cookie:

1. Log in to [Advent of Code](https://adventofcode.com) in your browser
2. Open browser developer tools and find the `session` cookie
3. Save the cookie value to a file named `.session` in the project root

## Usage

Once authenticated (via either method above), you can:

1. Execute `npm start -- --date=yyyy-mm-dd` to create the scaffold for the specified date.
2. Execute `npm start -- --date=yyyy-mm-dd --part [1|2]` to execute the code for the specified date for the specified part.
