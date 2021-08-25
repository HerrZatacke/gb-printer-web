$ErrorActionPreference = "Stop"

npm run build

$Version = Get-Content ./package.json |
ConvertFrom-JSON |
Select-Object -expand version

New-Item -ItemType Directory -Force -Path "./releases/$($Version)"

Compress-Archive -Force -Path ".\dist\*" -DestinationPath "./releases/$($Version)/data_w.zip"
