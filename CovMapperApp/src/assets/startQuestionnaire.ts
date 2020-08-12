import { Questionnaire } from '../covquestions-js/models/Questionnaire.generated';

export const startQuestionnaire: Questionnaire = {
  id: 'startQuestionnaire',
  schemaVersion: '1',
  version: 1,
  language: 'de',
  title: 'Einmaliger Fragebogen',
  meta: {
    author: 'Someone',
    availableLanguages: ['en'],
    creationDate: '2020-04-13T13:48:48+0000',
  },
  questions: [
    {
      id: 'gender',
      text: 'Geben Sie bitte ihr Geschlecht an.',
      type: 'select',
      options: [
        {
          text: 'weiblich',
          value: 'female',
        },
        {
          text: 'männlich',
          value: 'male',
        },
        {
          text: 'divers',
          value: 'diverse',
        },
      ],
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: 'genericCompletionResult',
      description: 'Anfangsbefragung abgeschlossen',
      results: [
        {
          id: 'completion',
          text: 'Vielen Dank für das initiale Einrichten Ihres Profils.',
          expression: true,
        },
      ],
    },
  ],
  testCases: [],
};
