# Webworker Migration ToDos:

## ImageGroups
* Test moving images to other groups (or root)
* Test moving groups to other groups (or root)!!

## Style/Global
* Move "from '@/items/client'" somewehere smart...
* Fix: ToDo: Navigation Effects
* Trigger for trashCount update is missing
* Avoid reading full image list → useImages({ list: true });
* Link version of export to new API Schemas
* Rename translation key "useImageGroups" → "useEditImageGroups"

## Import/Export
* Handle inheritance for JSONExportState and ExportableState → should get it's types from somewhere else
* Global Import and State Merging + Validating import and export states with zod

## Finally:
* Test all special filters (favoruite, mono, rgb, hasComment, etc.)
* Check startSyncImages/dropbox-tool loading all filtered
* Clean up unused Endpoints
