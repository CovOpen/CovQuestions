# Localisation

The translation of a questionnaire has two steps:
1. Extract strings to translate from base questionnaire
2. Create translated versions of the questionnaire

## Extract strings
Use `python3 localisation.py extract QUESIONNAIRE-ID -l LANGUAGES` to extract all strings from a questionnaire stored in `api/<API-VERSION>/src/questionnaires/<QUESTIONNAIRE-ID>/questionnaire.json`. `LANGUAGES` can be an array of languages you want to translate, but you can also just copy an existing language file. \
This command will add `translation.<LANGUAGE>.xlf` files to `api/<API-VERSION>/src/questionnaires/<QUESTIONNAIRE-ID>`. Translate them by adding the corresponding translation in the `target` container of each `trans-unit`. Dont forget to remove the `state` from the corresponding `source`.

## Create translated versions
Run `python3 localisation.py translate QUESIONNAIRE-ID`. This will create translated versions of `api/<API-VERSION>/src/questionnaires/<QUESTIONNAIRE-ID>/questionnaire.json` using all available translation files in the folder. The output is stored as `api/<API-VERSION>/questionnaires/<QUESTIONNAIRE-ID>/v<QUESIONNAIRE-VERSION>/questionnaire-<LANGUAGE>.json` where `QUESIONNAIRE-VERSION` is the major version of the questionnaire. This command also sets the `meta.language` attribute of the resulting JSON file.