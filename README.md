# Game Boy Camera Gallery

Game Boy Camera Gallery is a web app to organise, edit and share shots taken with the Game Boy Camera.  

- Import from cartridge dumps, serial logs, and community hardware projects
- Browse and organize shots in a responsive gallery with tagging and filtering
- Add custom frames and color palettes
- Print on original Game Boy Printer hardware via WebSerial
- [**Try it here** and read about all features](https://herrzatacke.github.io/gb-printer-web/)

## Development usage
The following options apply if you plan on contributing to this app:

### Environment Variables
Configure the application using these environment variables:

```bash
# Endpoint for environment configuration
NEXT_PUBLIC_ENV_ENDPOINT="/env.json"

# Base path for deployment (leave empty for root deployment, use leading slash otherwise like "/gb-printer-web")
NEXT_PUBLIC_BASE_PATH=""

# Development WiFi proxy host (for local development with WiFi devices)
NEXT_DEV_WIFI_PROXY_HOST=192.168.0.5
```

### Local Setup
This is a standard Next.js project. Clone the repository, install dependencies with `npm install`, and run `npm run dev` to start the development server.

Set up environment variables in `.env.local` if needed (see above).

### Community
* [Game Boy Camera Club Discord](https://gameboycamera.club/)
* [Game Boy Camera Telegram Channel](https://t.me/gameboycamera)
