# Webworker Migration ToDos:

## Style/Global
* Avoid reading full lists where possible
  * → useXXX({ list: true });
  * → console.warn('"xxx" loading full image list');
  * Fix: ToDo: Navigation Effects

## Finally:
* Test all special filters (favoruite, mono, rgb, hasComment, etc.)
* Check startSyncImages/dropbox-tool loading all filtered
* Clean up unused Endpoints
* Rename translation key "useImageGroups" → "useEditImageGroups"
