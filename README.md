# DeTalks

DeTalks is a mental health and wellness platform focused on self-guided support tools, access to professional therapy, and engagement features designed to support long-term habits.

## Features

- Self-guided support (mood tracking, journaling, calming exercises)
- Conversational assistant for guided check-ins and support
- Professional therapy discovery and session booking (where available)
- Community features and discussions (where available)
- Habit and streak-based engagement mechanics

## Tech stack

This repository is primarily a TypeScript front-end.

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

> Note: The broader product may integrate with external services (databases, auth, payments, messaging, and AI providers). Refer to the code and environment configuration for the exact integrations used in this repo.

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm (or your preferred Node package manager)

### Install

```bash
git clone https://github.com/h55n/Detalks.git
cd Detalks
npm install
```

### Run locally

```bash
npm run dev
```

Then open the URL printed by Vite (typically http://localhost:5173).

### Build

```bash
npm run build
```

### Lint (if configured)

```bash
npm run lint
```

## Configuration

If the app requires environment variables (API keys, endpoints, etc.), create a local `.env` file (or `.env.local`, depending on the setup) and populate the required values.

- Check for example files such as `.env.example`
- Search the codebase for `process.env` / `import.meta.env`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests/lint if available
4. Open a pull request

## License

If you plan to open-source this project, add a LICENSE file and reference it here.