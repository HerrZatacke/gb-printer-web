# Components Translation Status

This document lists all components from `/src/components/**/*.tsx` and indicates whether they contain user-facing strings that need translation.

| Component | Has User-Facing Strings | Already in Translation File | Notes | File Path |
|-----------|-------------------------|----------------------------|-------|-----------|
| AddPlugin | ✅ | ✅ | Likely has UI for adding plugins | [`src/components/AddPlugin/index.tsx`](src/components/AddPlugin/index.tsx) |
| BatchButtons | ✅ | ✅ | Contains action buttons with labels | [`src/components/BatchButtons/index.tsx`](src/components/BatchButtons/index.tsx) |
| ColorPicker | ❌ | ❌ | No user-facing strings, uses props for labels | [`src/components/ColorPicker/index.tsx`](src/components/ColorPicker/index.tsx) |
| ColorSlider | ❌ | ❌ | No user-facing strings | [`src/components/ColorSlider/index.tsx`](src/components/ColorSlider/index.tsx) |
| ConnectPrinter | ✅ | ✅ | Connection UI and messages | [`src/components/ConnectPrinter/index.tsx`](src/components/ConnectPrinter/index.tsx) |
| CopyDatabase | ✅ | ✅ | Database operations UI | [`src/components/CopyDatabase/index.tsx`](src/components/CopyDatabase/index.tsx) |
| Debug | ❌ | ❌ | No user-facing strings, displays passed text prop | [`src/components/Debug/index.tsx`](src/components/Debug/index.tsx) |
| EditFrameStartLine | ✅ | ✅ | Frame editing UI with up/down buttons | [`src/components/EditFrameStartLine/index.tsx`](src/components/EditFrameStartLine/index.tsx) |
| EditImageTabs | ✅ | ✅ | Tab labels and editor options | [`src/components/EditImageTabs/index.tsx`](src/components/EditImageTabs/index.tsx) |
| EnvInfo | ✅ | ✅ | Environment information (already translated) | [`src/components/EnvInfo/index.tsx`](src/components/EnvInfo/index.tsx) |
| Errors/ErrorMessage | ❌ | ❌ | Error messages (might be excluded from translation plan) | [`src/components/Errors/ErrorMessage.tsx`](src/components/Errors/ErrorMessage.tsx) |
| Errors/index | ❌ | ❌ | Error handling UI | [`src/components/Errors/index.tsx`](src/components/Errors/index.tsx) |
| ExportSettings | ✅ | ✅ | Export configuration (already translated) | [`src/components/ExportSettings/index.tsx`](src/components/ExportSettings/index.tsx) |
| FolderBreadcrumb | ✅ | ✅ | Navigation breadcrumbs | [`src/components/FolderBreadcrumb/index.tsx`](src/components/FolderBreadcrumb/index.tsx) |
| FolderTreeDialog | ✅ | ✅ | Folder selection dialog | [`src/components/FolderTreeDialog/index.tsx`](src/components/FolderTreeDialog/index.tsx) |
| Frame | ✅ | ✅ | Displays usage information in subheader | [`src/components/Frame/index.tsx`](src/components/Frame/index.tsx) |
| FrameContextMenu | ✅ | ✅ | Context menu for frames | [`src/components/FrameContextMenu/index.tsx`](src/components/FrameContextMenu/index.tsx) |
| FrameSelect | ✅ | ✅ | Frame selection UI | [`src/components/FrameSelect/index.tsx`](src/components/FrameSelect/index.tsx) |
| Frames | ✅ | ✅ | Frame collection display and management | [`src/components/Frames/index.tsx`](src/components/Frames/index.tsx) |
| Gallery | ❌ | ❌ | No hardcoded user-facing strings, composes other components | [`src/components/Gallery/index.tsx`](src/components/Gallery/index.tsx) |
| GalleryGrid | ❌ | ❌ | No user-facing strings, layout component | [`src/components/GalleryGrid/index.tsx`](src/components/GalleryGrid/index.tsx) |
| GalleryGridItem | ❌ | ❌ | No hardcoded user-facing strings, uses props | [`src/components/GalleryGridItem/index.tsx`](src/components/GalleryGridItem/index.tsx) |
| GalleryGroup | ✅ | ✅ | Group display with item count | [`src/components/GalleryGroup/index.tsx`](src/components/GalleryGroup/index.tsx) |
| GalleryGroupContextMenu | ✅ | ✅ | Context menu with edit/delete actions | [`src/components/GalleryGroupContextMenu/index.tsx`](src/components/GalleryGroupContextMenu/index.tsx) |
| GalleryHeader | ❌ | ❌ | No user-facing strings, composes other components | [`src/components/GalleryHeader/index.tsx`](src/components/GalleryHeader/index.tsx) |
| GalleryImage | ❌ | ❌ | No hardcoded user-facing strings | [`src/components/GalleryImage/index.tsx`](src/components/GalleryImage/index.tsx) |
| GalleryImageContextMenu | ✅ | ✅ | Context menu with actions for images | [`src/components/GalleryImageContextMenu/index.tsx`](src/components/GalleryImageContextMenu/index.tsx) |
| GalleryNumbers | ✅ | ✅ | Displays count information | [`src/components/GalleryNumbers/index.tsx`](src/components/GalleryNumbers/index.tsx) |
| GalleryViewSelect | ✅ | ✅ | View mode selection buttons | [`src/components/GalleryViewSelect/index.tsx`](src/components/GalleryViewSelect/index.tsx) |
| GameBoyImage | ❌ | ❌ | No user-facing strings, image rendering component | [`src/components/GameBoyImage/index.tsx`](src/components/GameBoyImage/index.tsx) |
| GlobalAppInit | ❌ | ❌ | No user-facing strings, initialization component | [`src/components/GlobalAppInit/index.tsx`](src/components/GlobalAppInit/index.tsx) |
| GreySelect | ✅ | ✅ | Selection UI for grayscale with blend modes | [`src/components/GreySelect/index.tsx`](src/components/GreySelect/index.tsx) |
| ImageLoading | ✅ | ❓ | Loading indicators/messages | [`src/components/ImageLoading/index.tsx`](src/components/ImageLoading/index.tsx) |
| ImageMeta | ✅ | ❓ | Metadata display | [`src/components/ImageMeta/index.tsx`](src/components/ImageMeta/index.tsx) |
| ImageRender | ❓ | ❓ | Rendering component | [`src/components/ImageRender/index.tsx`](src/components/ImageRender/index.tsx) |
| Import | ✅ | ❓ | Import UI and options | [`src/components/Import/index.tsx`](src/components/Import/index.tsx) |
| ImportPreviewImage | ✅ | ❓ | Preview UI for imports | [`src/components/ImportPreviewImage/index.tsx`](src/components/ImportPreviewImage/index.tsx) |
| Lightbox | ✅ | ❓ | Dialog with confirm/cancel buttons | [`src/components/Lightbox/index.tsx`](src/components/Lightbox/index.tsx) |
| MarkdownStack | ✅ | ❓ | Markdown content display | [`src/components/MarkdownStack/index.tsx`](src/components/MarkdownStack/index.tsx) |
| MetaTable | ✅ | ❓ | Table headers and content | [`src/components/MetaTable/index.tsx`](src/components/MetaTable/index.tsx) |
| MuiCleanThemeProvider | ❓ | ❓ | Theme provider (likely no strings) | [`src/components/MuiCleanThemeProvider/index.tsx`](src/components/MuiCleanThemeProvider/index.tsx) |
| Navigation | ✅ | ❓ | Navigation menu items | [`src/components/Navigation/index.tsx`](src/components/Navigation/index.tsx) |
| Navigation/Skeleton | ❓ | ❓ | Loading skeleton (likely no strings) | [`src/components/Navigation/Skeleton.tsx`](src/components/Navigation/Skeleton.tsx) |
| Overlays/BitmapQueue | ✅ | ❓ | Queue management UI | [`src/components/Overlays/BitmapQueue/index.tsx`](src/components/Overlays/BitmapQueue/index.tsx) |
| Overlays/Confirm | ✅ | ❓ | Confirmation dialogs | [`src/components/Overlays/Confirm/index.tsx`](src/components/Overlays/Confirm/index.tsx) |
| Overlays/ConnectSerial | ✅ | ✅ | Serial connection UI (already translated) | [`src/components/Overlays/ConnectSerial/index.tsx`](src/components/Overlays/ConnectSerial/index.tsx) |
| Overlays/DragOver | ✅ | ❓ | Drag and drop UI | [`src/components/Overlays/DragOver/index.tsx`](src/components/Overlays/DragOver/index.tsx) |
| Overlays/EditForm | ✅ | ❓ | Form labels and buttons | [`src/components/Overlays/EditForm/index.tsx`](src/components/Overlays/EditForm/index.tsx) |
| Overlays/EditFrame/* | ✅ | ❓ | Frame editing UI | [`src/components/Overlays/EditFrame/index.tsx`](src/components/Overlays/EditFrame/index.tsx), [`src/components/Overlays/EditFrame/EditFrameForm.tsx`](src/components/Overlays/EditFrame/EditFrameForm.tsx) |
| Overlays/EditImageGroup | ✅ | ❓ | Group editing UI | [`src/components/Overlays/EditImageGroup/index.tsx`](src/components/Overlays/EditImageGroup/index.tsx) |
| Overlays/EditPalette | ✅ | ❓ | Palette editing UI | [`src/components/Overlays/EditPalette/index.tsx`](src/components/Overlays/EditPalette/index.tsx) |
| Overlays/EditRGBN/* | ✅ | ❓ | RGBN editing UI | [`src/components/Overlays/EditRGBN/index.tsx`](src/components/Overlays/EditRGBN/index.tsx), [`src/components/Overlays/EditRGBN/Select.tsx`](src/components/Overlays/EditRGBN/Select.tsx) |
| Overlays/FilterForm/* | ✅ | ❓ | Filter UI components | [`src/components/Overlays/FilterForm/index.tsx`](src/components/Overlays/FilterForm/index.tsx), [`src/components/Overlays/FilterForm/filterFormTag.tsx`](src/components/Overlays/FilterForm/filterFormTag.tsx) |
| Overlays/FrameQueue | ✅ | ❓ | Frame queue management | [`src/components/Overlays/FrameQueue/index.tsx`](src/components/Overlays/FrameQueue/index.tsx) |
| Overlays/ImportQueue/* | ✅ | ❓ | Import queue UI | [`src/components/Overlays/ImportQueue/index.tsx`](src/components/Overlays/ImportQueue/index.tsx), [`src/components/Overlays/ImportQueue/ImportRow.tsx`](src/components/Overlays/ImportQueue/ImportRow.tsx) |
| Overlays/LightboxImage | ✅ | ❓ | Image lightbox UI | [`src/components/Overlays/LightboxImage/index.tsx`](src/components/Overlays/LightboxImage/index.tsx) |
| Overlays/PickColors | ✅ | ❓ | Color picker UI | [`src/components/Overlays/PickColors/index.tsx`](src/components/Overlays/PickColors/index.tsx) |
| Overlays/ProgressBox | ✅ | ❓ | Progress indicators | [`src/components/Overlays/ProgressBox/index.tsx`](src/components/Overlays/ProgressBox/index.tsx) |
| Overlays/ProgressLogBox | ✅ | ❓ | Progress log display | [`src/components/Overlays/ProgressLogBox/index.tsx`](src/components/Overlays/ProgressLogBox/index.tsx) |
| Overlays/Serials | ✅ | ❓ | Serial device management | [`src/components/Overlays/Serials/index.tsx`](src/components/Overlays/Serials/index.tsx) |
| Overlays/SortForm | ✅ | ❓ | Sorting options UI | [`src/components/Overlays/SortForm/index.tsx`](src/components/Overlays/SortForm/index.tsx) |
| Overlays/SyncSelect | ✅ | ❓ | Sync options UI | [`src/components/Overlays/SyncSelect/index.tsx`](src/components/Overlays/SyncSelect/index.tsx) |
| Overlays/Trashbin | ✅ | ❓ | Trash management UI | [`src/components/Overlays/Trashbin/index.tsx`](src/components/Overlays/Trashbin/index.tsx) |
| Overlays/VideoParamsForm | ✅ | ❓ | Video parameter form | [`src/components/Overlays/VideoParamsForm/index.tsx`](src/components/Overlays/VideoParamsForm/index.tsx) |
| Pagination | ✅ | ❓ | Pagination controls | [`src/components/Pagination/index.tsx`](src/components/Pagination/index.tsx) |
| PaginationButton | ✅ | ❓ | Pagination button labels | [`src/components/PaginationButton/index.tsx`](src/components/PaginationButton/index.tsx) |
| Palette | ❓ | ❓ | Palette display component | [`src/components/Palette/index.tsx`](src/components/Palette/index.tsx) |
| PaletteContextMenu | ✅ | ❓ | Context menu for palettes | [`src/components/PaletteContextMenu/index.tsx`](src/components/PaletteContextMenu/index.tsx) |
| PaletteIcon | ❓ | ❓ | Icon component (likely no strings) | [`src/components/PaletteIcon/index.tsx`](src/components/PaletteIcon/index.tsx) |
| Palettes | ✅ | ❓ | Palette management UI | [`src/components/Palettes/index.tsx`](src/components/Palettes/index.tsx) |
| PaletteSelect | ✅ | ❓ | Palette selection UI | [`src/components/PaletteSelect/index.tsx`](src/components/PaletteSelect/index.tsx) |
| PluginSelect | ✅ | ❓ | Plugin selection UI | [`src/components/PluginSelect/index.tsx`](src/components/PluginSelect/index.tsx) |
| PrinterReport | ✅ | ❓ | Printer status reporting | [`src/components/PrinterReport/index.tsx`](src/components/PrinterReport/index.tsx) |
| Remote | ✅ | ❓ | Remote connection UI | [`src/components/Remote/index.tsx`](src/components/Remote/index.tsx) |
| RGBNSelect | ✅ | ❓ | RGBN selection UI | [`src/components/RGBNSelect/index.tsx`](src/components/RGBNSelect/index.tsx) |
| SettingsDropbox | ✅ | ✅ | Dropbox settings (already translated) | [`src/components/SettingsDropbox/index.tsx`](src/components/SettingsDropbox/index.tsx) |
| SettingsGeneric | ✅ | ✅ | Generic settings (already translated) | [`src/components/SettingsGeneric/index.tsx`](src/components/SettingsGeneric/index.tsx) |
| SettingsGit | ✅ | ✅ | Git settings (already translated) | [`src/components/SettingsGit/index.tsx`](src/components/SettingsGit/index.tsx) |
| SettingsPlugins/* | ✅ | ✅ | Plugin settings (already translated) | [`src/components/SettingsPlugins/index.tsx`](src/components/SettingsPlugins/index.tsx), [`src/components/SettingsPlugins/PluginConfig.tsx`](src/components/SettingsPlugins/PluginConfig.tsx), [`src/components/SettingsPlugins/PluginInputField.tsx`](src/components/SettingsPlugins/PluginInputField.tsx) |
| SettingsTabs | ✅ | ✅ | Settings tabs (already translated) | [`src/components/SettingsTabs/index.tsx`](src/components/SettingsTabs/index.tsx) |
| SettingsWiFi/* | ✅ | ✅ | WiFi settings (already translated) | [`src/components/SettingsWiFi/index.tsx`](src/components/SettingsWiFi/index.tsx), [`src/components/SettingsWiFi/APConfig.tsx`](src/components/SettingsWiFi/APConfig.tsx) |
| StorageWarning | ✅ | ❓ | Storage warning messages | [`src/components/StorageWarning/index.tsx`](src/components/StorageWarning/index.tsx) |
| TagsList | ✅ | ❓ | Tag display UI | [`src/components/TagsList/index.tsx`](src/components/TagsList/index.tsx) |
| TagsSelect/* | ✅ | ❓ | Tag selection UI | [`src/components/TagsSelect/index.tsx`](src/components/TagsSelect/index.tsx), [`src/components/TagsSelect/InputNewTag.tsx`](src/components/TagsSelect/InputNewTag.tsx) |
| WebUSBGreeting/* | ✅ | ✅ | WebUSB greeting (already translated) | [`src/components/WebUSBGreeting/index.tsx`](src/components/WebUSBGreeting/index.tsx), [`src/components/WebUSBGreeting/EnableWebUSB.tsx`](src/components/WebUSBGreeting/EnableWebUSB.tsx) |

## Priority Components for Translation

Based on user interaction frequency and visibility, these components should be prioritized for translation:

1. **GalleryImageContextMenu** - High visibility during image interaction
2. **Lightbox** - Common dialog component used throughout the app
3. **Navigation** - Always visible main navigation
4. **Overlays/Confirm** - Used for all confirmation dialogs
5. **GalleryHeader** - Always visible in gallery view
6. **TagsSelect** - Used for image organization
7. **Import** - Critical for importing images
8. **Overlays/EditForm** - Used for editing image metadata
9. **PaletteContextMenu** - Used for palette management
10. **Overlays/Trashbin** - Used for deletion management

## Next Steps

1. For each component marked with ✅ in "Has User-Facing Strings" and ❓ in "Already in Translation File":
   - Examine the component to extract all user-facing strings
   - Add these strings to the translation files (`en.json` and `de.json`)
   - Update the component to use the translation function instead of hardcoded strings

2. Start with the priority components listed above to make the most impact quickly.

3. Ensure consistent naming conventions for translation keys across all components.
