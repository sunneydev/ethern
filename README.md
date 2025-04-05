# Ethern

<p align="center">
  <img src="apps/www/public/ethern.svg" alt="Ethern Logo" width="150"/>
</p>

<p align="center">
  <strong>An open-source platform for delivering Over-The-Air (OTA) updates to React Native applications.</strong>
</p>

<p align="center">
  <!-- Add badges here once you set them up -->
  <!-- e.g., <a href="..."><img src="..." alt="Build Status"/></a> -->
  <!-- e.g., <a href="..."><img src="..." alt="npm version"/></a> -->
  <!-- e.g., <a href="..."><img src="..." alt="License"/></a> -->
</p>

---

Ethern provides a streamlined, self-hostable, and potentially more cost-effective alternative for managing and deploying OTA updates for your React Native apps, designed to be compatible with the `expo-updates` module. Ship faster, iterate quickly, and keep your users on the latest version without app store reviews for every minor change.

## ✨ Key Features

*   **🚀 Instant OTA Updates:** Push updates directly to users' devices.
*   **💻 Simple CLI:** Easy-to-use command-line interface (`ethern-cli`) for publishing updates.
*   **📊 Web Dashboard:** Manage projects, view update history, monitor usage, and configure settings via a web interface (`apps/www`).
*   **🔧 Expo Compatible:** Designed as a drop-in replacement for Expo Updates hosting. Use `expo-updates` in your app with Ethern as the backend.
*   **☁️ Cloudflare Powered API:** Built with Hono on Cloudflare Workers for scalability and performance (`apps/api`).
*   **💾 Database Integration:** Uses Drizzle ORM with D1 for data persistence (`packages/db`).
*   **💰 Cost-Effective:** Manage your own update infrastructure, potentially saving costs compared to hosted solutions (especially at scale).
*   **🧩 Modular Structure:** Organized as a monorepo for better code management and sharing.
*   **🔓 Open Source:** Freedom to inspect, modify, and contribute.

## 🤔 Why Ethern?

While solutions like Expo EAS Updates offer a great service, Ethern aims to provide an alternative for teams and individuals who:

*   Prefer self-hosting their update infrastructure for more control.
*   Are looking for potentially more cost-effective solutions at scale.
*   Want an open-source platform they can extend or integrate deeply.
*   Need a simple CLI and dashboard experience focused purely on OTA updates.

## 🚀 Getting Started (Using the CLI)

This guide assumes you want to use the Ethern CLI to publish updates to an Ethern instance (either self-hosted or a public one if available).

**Prerequisites:**

*   Node.js (or Bun) and npm/yarn/pnpm installed.
*   A React Native project configured with `expo-updates`.

**1. Install the CLI:**

```bash
npm install -g ethern-cli
# or
yarn global add ethern-cli
# or
pnpm add -g ethern-cli
```

**2. Authenticate:**

You need an account on the Ethern instance you're targeting. Log in via the CLI:

```bash
ethern auth
```

This will provide a code and open a browser window for you to confirm the login.

**3. Publish Updates:**

Navigate to your React Native project directory:

```bash
cd /path/to/your/react-native-app
```

Run the publish command:

```bash
ethern
# or
ethern update
```

*   **First time:** If the project isn't linked to Ethern yet, the CLI will guide you through creating or linking a project on the Ethern platform.
*   **Subsequent times:** This command will:
    *   Run `expo export` to build and bundle your app updates.
    *   Communicate with the Ethern API to determine which assets need uploading.
    *   Upload new assets to the configured storage (e.g., Cloudflare R2).
    *   Create a new update record and manifest on the Ethern platform.
    *   Your app (using `expo-updates`) will then fetch the latest update from the Ethern API endpoint.

## 🛠️ Project Structure

Ethern is organized as a monorepo using pnpm workspaces:

*   `apps/api`: The core API built with Hono, running on Cloudflare Workers. Handles authentication, project management, update handshakes, and manifest serving.
*   `apps/cli`: The command-line tool (`ethern-cli`) developers use to interact with the Ethern API and publish updates.
*   `apps/www`: The Next.js web application providing the dashboard for users to manage their account, projects, updates, billing, etc.
*   `packages/db`: Contains the Drizzle ORM schema, migrations, and database repository logic for interacting with the D1 database.
*   `packages/lib`: Shared utility libraries used across different apps/packages (e.g., Redis client).
*   `packages/utils`: Core utility functions (crypto, helpers, type definitions) shared across the monorepo.

## 💻 Development Setup (Contributing)

Interested in contributing to Ethern? Here's how to set up your development environment:

**Prerequisites:**

*   Node.js and Bun
*   pnpm (`npm install -g pnpm`)
*   Cloudflare Account (for deploying API and potentially R2/D1)
*   Git

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-github-username/ethern.git
    cd ethern
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    *   Copy example configuration files:
        *   `apps/api/wrangler.example.toml` -> `apps/api/wrangler.toml`
        *   `apps/www/wrangler.example.toml` -> `apps/www/wrangler.toml`
        *   You might need `.env` files based on secrets required (e.g., `apps/www/.env.local`). Check individual app/package READMEs if they exist, or infer from the code (`src/server/env.ts`).
    *   Fill in the necessary credentials in your `wrangler.toml` files and `.env` files:
        *   Cloudflare Account ID, D1 Database IDs, R2 Bucket Names, KV Namespace IDs.
        *   `SECRET_KEY` (for signing/encryption, must be consistent across API/Web).
        *   OAuth credentials (GitHub, Google).
        *   Paddle API Keys (if using Paddle for billing).
        *   Resend API Key (if using Resend for emails).

4.  **Database Setup:**
    *   Ensure you have Wrangler configured (`wrangler login`).
    *   Create the necessary D1 databases, R2 buckets, and KV namespaces in your Cloudflare account if you haven't already. Update `wrangler.toml` files accordingly.
    *   Apply database migrations (run from `packages/db`):
        ```bash
        pnpm --filter @ethern/db migrate # For local wrangler dev
        # or
        pnpm --filter @ethern/db migrate:prod # For remote deployment
        ```

5.  **Run the Apps:**
    *   **API (Cloudflare Worker):**
        ```bash
        # In apps/api directory or use filter
        pnpm --filter @ethern/api dev
        ```
    *   **Web Dashboard (Next.js):**
        ```bash
        # In apps/www directory or use filter
        pnpm --filter @ethern/www dev
        ```
    *   **CLI:** Build and link for global use, or run directly.
        ```bash
        # Build
        pnpm --filter ethern-cli build

        # Link globally (optional)
        cd dist/apps/cli
        pnpm link --global

        # Or run directly from root
        bun apps/cli/src/index.ts -- <command> <flags>
        ```

## 🙏 Contributing

Contributions are welcome! Whether it's bug reports, feature requests, or code contributions, please feel free to:

1.  Check for existing issues or open a new issue to discuss your ideas.
2.  Fork the repository.
3.  Create a new branch (`git checkout -b feature/your-feature-name`).
4.  Make your changes.
5.  Commit your changes (`git commit -m 'Add some feature'`).
6.  Push to the branch (`git push origin feature/your-feature-name`).
7.  Open a Pull Request.

Please adhere to the existing code style and add tests where applicable.
