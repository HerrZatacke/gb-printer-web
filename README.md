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

#### Development
```bash
# Development WiFi proxy host (for local development with WiFi devices)
NEXT_DEV_WIFI_PROXY_HOST=192.168.0.5
```

#### Self-hosting (with or without subfolders)
```bash
# Endpoint for environment configuration
NEXT_PUBLIC_ENV_ENDPOINT="/env.json"

# Base path for deployment (leave empty for root deployment, use leading slash otherwise like "/gb-printer-web")
NEXT_PUBLIC_BASE_PATH=""
```
Self hosting the webapp including dropbox sync requires you create a dropbox app through the [Dropbox App Console](https://www.dropbox.com/developers/apps/)  
Create the app as a *"Scoped App (App Folder)"*
```bash
NEXT_PUBLIC_DROPBOX_APP_KEY="<your_app_key>"
NEXT_PUBLIC_DROPBOX_APP_PATH="/home/Apps/<your_app_folder_name>/"
```

### Local Setup
This is a standard Next.js project. Clone the repository, install dependencies with `npm install`, and run `npm run dev` to start the development server.

Set up environment variables in `.env.local` if needed (see above).

## Thanks
* [Raphaël Boichot](https://github.com/Raphael-Boichot/) for help with the French locale.
* Various members of the Game Boy Camera community for countless suggestions, bugreports and testing.

## Community
* [Game Boy Camera Club Discord](https://gameboycamera.club/)
* [Game Boy Camera Telegram Channel](https://t.me/gameboycamera)

