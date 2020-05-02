# API

This is a static file API.

In order to generate the files for the api run `npm run build`.

This will gather everything from `./data` (questionnaires, translations) and generate the files in `dist`.

## Update questionnaires

In order to update a questionnaire or submit a new one:

1. (Re-)place the questionnaire in the `data/questionnaire` folder.
2. Run `npm run i18n-extract` this will modify your questionnaire and update it with unique translation ids. Furtermore it submits your strings to the localization file (in `i18n`).

(Run the build process)

## Localisation

To extract the strings from the questionares in `src/data` run `npm run i18n-extract`.

> To add new Localizations have a look at the docs

The translation of a questionnaire has two steps:

1. Extract strings to translate from base questionnaire
2. Create translated versions of the questionnaire
