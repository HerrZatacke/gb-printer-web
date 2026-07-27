# Webworker Migration ToDos:

## Worker/API
* Remove Pagination from queries which are supposed to return the full set (of hashes)
* deleting images and imageGroups must also update dependent imageGroups
* Trigger for cleanup on worker side is missing (after image deletion etc)

## ImageGroups
* Saving imageGroups has weird effect: some images remaining in parent
* Redirect after editing/saving imageGroup happens too early?
* Test moving images to other groups (or root)
* Test moving groups to other groups (or root)!!

## Style/Global
* Move "from '@/items/client'" somewehere smart...
* Fix: ToDo: Navigation Effects
* Trigger for trashCount update is missing
* Avoid reading full image list -> useImages({ list: true });
* Link version of export to new API Schemas
* Rename translation key "useImageGroups" -> "useEditImageGroups"

## Import/Export
* Handle inheritance for JSONExportState and ExportableState -> should get it's types from somewhere else
* Global Import and State Merging + Validating import and export states with zod

## Finally:
* Test all special filters (favoruite, mono, rgb, hasComment, etc)
* Check startSyncImages/dropbox-tool loading all filtered
* Clean up unused Endpoints
