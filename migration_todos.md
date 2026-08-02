# Webworker Migration ToDos:

## Filters
* Add specialTags-property to StoredImage and SerializableImageGroup
* Populate specialTags-properties on save/update / maintenanceTask
* Use specialTags-property to simplify faceting
* Eliminate usages of SpecialTags.FILTER_RECENT and hostApi.getRecentImports
* Uncaught (in promise) CancelledError: CancelledError (Tanstack somewhere...)

## Finally:
* Test all special filters (favourite, mono, rgb, hasComment, etc.)
* Clean up unused Endpoints

## Later
* // ToDo: find way to calulate group position for groups without coverimage (using viewItems)?
* // ToDo: updateImages should report if groups were also affected (e.g. by adding new images)
* Try to repair imageGroups with missing covers
