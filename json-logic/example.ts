import { IQuestion, IQuestionAnswer, QuestionType, IQuestionnaire, IQuestionnaireMeta  } from './schema'


const example: IQuestionnaire = {
  meta: { 
    author: 'Alexander',
    languages: ['DE'],
    name: 'Example',
    version: '0.1'
  },
  questions: [
    {
      id: 'q1_contact',
      question: 'Gab es Kontakt zu bestätigten Fällen?',
      type: QuestionType.BOOLEAN
    },
    {
      id: 'q2_contact_when',
      question: 'Wann trat der Kontakt auf?',
      type: QuestionType.DATE,
      guard: { 
        "var": "q1_contact.value" 
      }
    },
    {
      id: 'q3_symptoms',
      question: 'Symptome?',
      type: QuestionType.MULTISELECT,
      options: [
        { answer: 'Husten', value: 'cough' },
        { answer: 'Fieber', value: 'fever' },
        { answer: 'Atembeschwerden', value: 'respiratory' }
      ]
    },
    {
      id: 'q4_symptoms_when',
      question: 'Ab wann gab es Symptome?',
      type: QuestionType.DATE,
      guard: { 
        "var": "q3_symptoms.value" 
      }
    },
    {
      id: 'q5_risk_factors',
      question: 'Gibt es Risikofaktoren?',
      type: QuestionType.BOOLEAN
    },
    {
      id: 'q6_chronic_afflictions',
      question: 'Gibt es Chronische Beschwerden?',
      type: QuestionType.BOOLEAN
    },
    {
      id: 'q6_medical_staff',
      question: 'Medizinisches Personal?',
      type: QuestionType.BOOLEAN,
      guard: { 
        ">=": [{"var": "v1_risk"}, 2]
      }
    }
  ],
  variables: {
    "v1_risk": {
      default: 0,
      value: {
        "if": [
          {"var": "q0_contact.value"},
          {"if": [
            {"var": "q0_symptoms.value"},
            2,
            1]
          },
          0
        ]
      }
    }
  }
}