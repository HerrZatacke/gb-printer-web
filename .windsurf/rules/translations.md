---
trigger: model_decision
description: Translating language JSON files
globs: 
---

* When generating translations, the keys in the source and target need to match 100%
* Do not omit special i18n formatting commands for placeholders.
* Do not alter message placeholders.
* Translation is only completed if _all_ keys are translated
* Translation is only completed if no extra keys are created
* Do not change the order of sections or messages in any way
* Translates messages should not use ascii char 34 quotes (") or ascii char 35 quotes (').
* Use ~o~ and ~c~ as placeholder for opening/closing typographic quotes so I can find/replace them easily.
* The files to be translated have over 600 lines, so translate them in steps/parts of ~100-200 lines. Don't try to create a complete translation as this will fail.
* Don't give me code to copy/paste into the files. Just edit the file in steps/parts
* run `npm run comparelangs <sourcefile> <testfile>` to verify basic integrity of the translation
