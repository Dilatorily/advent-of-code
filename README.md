# advent-of-code

Repository for my solutions for [Advent of Code](https://adventofcode.com).

## Prerequisites

- [Node.js v24+](https://nodejs.org/) (with npm) - Supports TypeScript natively

## Authentication

**Prerequisites:**

- GitHub credentials stored in Bitwarden (with TOTP if 2FA is enabled)
- Bitwarden API key ([learn how to obtain one](https://bitwarden.com/help/personal-api-key/))

**Setup:**

1. Install dependencies (includes Bitwarden CLI):

   ```bash
   npm install
   ```

2. Get your session cookie:
   - **Automated**: Run `npm run login` - it will prompt for your Bitwarden configuration and automatically create `.env` file
   - **Manual**: Log in to [Advent of Code](https://adventofcode.com) in your browser, find the `session` cookie in developer tools, and save it to a file named `.session` in the project root

## Usage

**Available npm scripts:**

- `npm start` - Run the main CLI (scaffolds new days or runs solutions)
- `npm test` - Run tests
- `npm run login` - Authenticate with Advent of Code using Bitwarden
- `npm run typings` - Run TypeScript type checking

**Once authenticated, you can:**

1. Execute `npm start -- --date=yyyy-mm-dd` to create the scaffold for the specified date
2. Execute `npm start -- --date=yyyy-mm-dd --part [1|2]` to execute the code for the specified date for the specified part
