# Webworker Migration ToDos:
* // ToDo: add batched loader
* Remove Pagination from queries which are supposed to return the full set (of hashes)
* Saving imageGroups has weird effect: some images remaining in parent
* Redirect after editing/saving imageGroup happens too early?
* Move "from '@/items/client'" somewehere smart...
* Fix: ToDo: Navigation Effects
* deleting images and imageGroups must also update dependent imageGroups
* Trigger for trashCount update is missing
* Trigger for cleanup on worker side is missing (after image deletion etc)
* Avoid reading full image list -> useImages({ list: true });
* Test moving images to other groups (or root)
* Test moving groups to other groups (or root)!!
* Inside useStores: // ToDo: The map function is a migration. Must be moved or removed
* Handle inheritance for JSONExportState and ExportableState -> should get it's types from somewhere else
* Link version of export to new API Schemas
* check usage of cleanImages.ts (still needed?)
* Rename translation key "useImageGroups" -> "useEditImageGroups"
* Strange behaviour when importing batch items and creating a group: Images are temporarily listed twice???

## Last ToDos:
* Global Import and State Merging + Validating import and export states with zod
* Test all special filters (favoruite, mono, rgb, hasComment, etc)
* Check startSyncImages/dropbox-tool loading all filtered
* Clean up unused Endpoints
