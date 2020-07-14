$ErrorActionPreference = "Stop"

$ESPProjectPath = Get-Content ./config.json |
ConvertFrom-JSON |
Select-Object -expand deploy |
Select-Object -expand dir

$Version = Get-Content ./package.json |
ConvertFrom-JSON |
Select-Object -expand version

New-Item -ItemType Directory -Force -Path "./releases/$($Version)"

Compress-Archive -Force -Path "$($ESPProjectPath)\*" -DestinationPath "./releases/$($Version)/data_w.zip"
