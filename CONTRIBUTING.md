# Contributing

## Translate Questionnaires

[Head over to Crowdin and submit translations in any language you speak.](https://wevsvirushack.crowdin.com/covquestions)

## Create a Questionnaire

Head over to our Questionnaire Creator (where you can also try out every Questionnaire from the API):
https://covquestions.z16.web.core.windows.net/

## Submit a NEW Questionnaire

After creating you Questionnaire you can either send us an email, open an issue or follow this guide:

1. Clone this repo `git clone https://github.com/CovOpen/CovQuestions.git`.
2. Navigate to [`api/v1`](/api/v1).
3. Add your `questionnaire.json` to the [`input`](/api/v1/input) folder. Make sure:
   - that `id` and `version` of your Questionnaire are unique. (Check the [`api/v1/src/data`](/api/v1/src/data) folder for id's (folder name) and versions (child folder names))
   - again the id (look into [src/data](./src/data) for already published questionnaires).
   - the version number and maybe increase it.
   - the questionnaire has to be in english (you can submit/add translations later)
   - the language of the questionnaire and the language specified in the `language` attribute.
4. Run `npm run pre-build`
5. Create a Branch, commit and open a PR which can be merged to master.

Now the CD Pipeline will take over.

## Submit a new version of a Questionnaire

> TODO

1. Run npm run pre-build-addnpm run pre-build
2. (Optional) Add your translation files to data/questionnaires/<your Questionnaire Id>/i18n.
3. Run npm run pre-build-trans. (If you dont have any translations you can run both commands with npm run pre-build)

## Translate a Questionnaire

Head over to https://wevsvirushack.crowdin.com/covquestions and start translating.

## Preview

The preview is deployed on Azure Blob Storage. Get the workflow from the according workflow files.

In order to create your azure credentials follow [this guide](https://github.com/Azure/login).
