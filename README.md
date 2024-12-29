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

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A running instance of [Open-WebUI Pipelines](https://github.com/open-webui/pipelines)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_PIPELINES_API_BASE_URL=your_pipelines_api_url
NEXT_PUBLIC_PIPELINES_API_KEY=your_api_key
```

Replace:
- `your_pipelines_api_url` with the URL of your Pipelines container (e.g., `http://localhost:8000` or `https://your-domain.com`)
- `your_api_key` with your Pipelines API key

### Installation
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Navigate to `http://localhost:3000`.