# Contributing

## Create a Questionnaire

Head over to our Questionnaire Creator (where you can also try out every Questionnaire from the API):
https://covquestions.z16.web.core.windows.net/

## Submit a NEW Questionnaire

After creating you Questionnaire you can either send us an email, open an issue or follow this guide:

1. Clone this repo `git clone https://github.com/CovOpen/CovQuestions.git`.
2. Navigate to [`api/v1`](/api/v1).
3. Add your `questionnaire.json` to the `./input` folder. Make sure:
   - that `id` and `version` of your Questionnaire are unique. (Check the [`api/v1/src/data`](/api/v1/src/data) folder for id's (folder name) and versions (child folder names))
   - the questionnaire has to be in english (you can submit/add translations later)
4. Run `npm run pre-build`
7. Commit and create a Branch which can be merged to master.

Now the CD Pipeline will take over. 

## Submit a new version of a Questionnaire

> TODO

1. Run npm run pre-build-addnpm run pre-build
2. (Optional) Add your translation files to data/questionnaires/<your Questionnaire Id>/i18n.
3. Run npm run pre-build-trans. (If you dont have any translations you can run both commands with npm run pre-build)



## Translate a Questionnaire

Head over to https://wevsvirushack.crowdin.com/covquestions and start translating.
