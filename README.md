# Pipelines Frontend

This is a standalone frontend for the [Open-WebUI Pipelines](https://github.com/open-webui/pipelines) container. It provides a user interface for managing AI model pipelines, including adding, modifying, and deleting pipelines, as well as configuring their valve settings.
## Why?

The Pipelines container provides an openai-compatible API endpoint that any OpenAI client can talk to. However, the UI for adding, modifying and deleting pipelines is currently integrated into Open-WebUI itself. By providing a separate UI, the Pipelines container can be run completely independently of Open-WebUI.

## Features

- Upload pipeline files (.py)
- Add pipelines from URLs
- View and manage existing pipelines
- Configure pipeline valve settings via JSON editor
- View available AI models and their pipeline associations

## Prerequisites

- Node.js 18+ installed
- A running instance of [Open-WebUI Pipelines](https://github.com/open-webui/pipelines)

## Environment Setup

The application uses environment variables for configuration. Create a `.env.local` file based on `.env.example`:

```bash
cp ./src/app/.env.example .env.local
```

Configure the following variables in your `.env.local`:

- `PIPELINES_API_BASE_URL`: URL of your Pipelines API (e.g., `http://localhost:8000`)
- `PIPELINES_API_KEY`: Your Pipelines API key

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Navigate to `http://localhost:3000`.

### Docker

Build the dockerfile:

```bash
docker build -t pipelines-frontend .

(or)

docker compose build
```

Run using docker compose:

```bash
docker compose up
```

Navigate to `http://localhost:3000`.