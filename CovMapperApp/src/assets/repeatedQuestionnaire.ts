// @ts-nocheck
import { Questionnaire } from '../covquestions-js/models/Questionnaire.generated';

export const repeatedQuestionnaire: Questionnaire = {
  id: 'repeatedQuestionnaire',
  schemaVersion: '1',
  version: 1,
  language: 'en',
  title: 'Simple Erfassung von generellen Symptomen',
  meta: {
    author: 'Someone',
    availableLanguages: ['en'],
    creationDate: '2020-04-13T13:48:48+0000',
  },
  questions: [
    {
      options: [
        {
          text: 'Husten',
          value: 'Husten',
        },
        {
          text: 'Schnupfen',
          value: 'Schnupfen',
        },
        {
          text: 'Nein',
          value: 'Nein',
        },
      ],
      id: 'erkaeltungssymptome',
      text: 'Haben Sie folgende Erkältungssymptome?',
      type: 'select',
    },
    {
      options: [
        {
          text: 'Ja',
          value: 'Ja',
        },
        {
          text: 'Nein',
          value: 'Nein',
        },
      ],
      id: 'weiteresymptome',
      text: 'Leiden Sie unter Kurzatmigkeit?',
      type: 'select',
    },
  ],
  variables: [],
  resultCategories: [
    {
      id: 'completion',
      description: 'Vielen Dank für das Beantworten',
      results: [
        {
          id: 'Danke',
          text: 'Sie helfen damit die CovMap akurater zu machen.',
          expression: true,
        },
      ],
    },
    {
      results: [
        {
          expression: {
            or: [
              {
                '==': [
                  {
                    var: 'erkaeltungssymptome',
                  },
                  'Husten',
                ],
              },
              {
                '==': [
                  {
                    var: 'erkaeltungssymptome',
                  },
                  'Schnupfen',
                ],
              },
              {
                '==': [
                  {
                    var: 'weiteresymptome',
                  },
                  'Ja',
                ],
              },
            ],
          },
          id: 'Empfehlung',
          text: 'Sie haben Symptome, melden Sie sich bitte.',
        },
        {
          expression: true,
          id: 'no_symptoms',
          text: 'Sie haben keine Symptome.',
        },
      ],
      id: 'suggestion',
      description: 'Handlungsempfehlung',
    },
  ],
  testCases: [],
};
