# gb-items-source

The transport-agnostic query and mutation logic for gb-printer-web's item data (images, frames, groups, palettes, plugins, and their binary payloads) — plus the repository contracts that logic runs against.

This package holds **all business logic**: query functions, filtering, tree building, aggregation, maintenance tasks.  

None of it talks to IndexedDB, SQL, or any specific storage engine directly — it's written entirely against the `ItemRepository`/`IndexedItemRepository` interfaces, so it runs unchanged regardless of which backend actually serves the data.
