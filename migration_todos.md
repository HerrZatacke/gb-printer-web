# Webworker Migration ToDos:

## Import/Export
* Link version of export to new API Schemas

## Style/Global
* Avoid reading full image list 
  * → useImages({ list: true });
  * → console.warn('"xxx" loading full image list');
* Fix: ToDo: Navigation Effects

## Finally:
* Test all special filters (favoruite, mono, rgb, hasComment, etc.)
* Check startSyncImages/dropbox-tool loading all filtered
* Clean up unused Endpoints
* Rename translation key "useImageGroups" → "useEditImageGroups"
