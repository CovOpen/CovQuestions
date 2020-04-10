import { QuestionType, IQuestionnaire  } from './schema'

/**
 * This is a declaration of Alex's sample questionaire as typescript.
 * 
 * It is roughly equivalent to a JSON representation, 
 * but easier and faster to write during this drafting process AND we can use inline comments.
 *  
 * For the JSON version, please see example.json.
 */
const example: IQuestionnaire = {
  id: 'aa43ae11-2b3c-46dd-ac01-c901c3d36a3e',
  schemaVersion: '0.0.0.1',
  version: '0.0.0.1',
  meta: { 
    author: 'Alexander',
    language: 'DE',
    title: 'Example',
    creationDate: '2020-04-10T18:48:48+0000'
  },
  // Here go all our questions.
  questions: [
    {
      id: 'q1_contact',
      text: 'Gab es Kontakt zu bestätigten Fällen?',
      type: QuestionType.Boolean
    },
    {
      id: 'q2_contact_when',
      text: 'Wann trat der Kontakt auf?',
      type: QuestionType.Date,
      // Skip that depends on the previous question.
      enableWhen: { 
        "var": "q1_contact.value" 
      }
    },
    {
      id: 'q3_symptoms',
      text: 'Symptome?',
      type: QuestionType.Multiselect,
      options: [
        { text: 'Husten', value: 'cough' },
        { text: 'Fieber', value: 'fever' },
        { text: 'Atembeschwerden', value: 'respiratory' }
      ]
    },
    {
      id: 'q4_symptoms_when',
      text: 'Ab wann gab es Symptome?',
      type: QuestionType.Date,
      // Skip that depends on the previous question.
      enableWhen: { 
        "var": "q3_symptoms.value"
      }
    },
    {
      id: 'q5_risk_factors',
      text: 'Gibt es Risikofaktoren?',
      type: QuestionType.Boolean
    },
    {
      id: 'q6_chronic_afflictions',
      text: 'Gibt es Chronische Beschwerden?',
      type: QuestionType.Boolean
    },
    {
      id: 'q6_medical_staff',
      text: 'Medizinisches Personal?',
      type: QuestionType.Boolean,
      // Skip that depends on a variable.
      enableWhen: { 
        "in": [{ "var": "v1_risk.value" }, ["HIGH_RISK", "MEDIUM_RISK_A", "MEDIUM_RISK_B"]]
      }
    }
  ],
  // Here go all our variables.
  variables: [
    {
      id: "v_contact_relevant",
      // If contact is less than 14 days apart (using a now global)
      value: { "<=": [{ "-": [{ "var": "q2_contact_when.value"}, { "var": "g_now.value"}]}, 14] }
    },
    {
      id: "v_symptoms_relevant",
      // If contact is less than 14 days apart (using a now global)
      value: { ">=": [{"var": "q2_symptoms.count"}, 1] }
    },
    {
      id: "v1_risk",
      value: {
        "if": [
          // If had contact
          {"var": "q0_contact.value"},
          {"if": [
            // If more than one symptom.
            {"var": "v_symptoms_relevant" },
            { "if": [
              // If symtoms and date are less than two weeks apart
              { "<=": [{ "-": [{ "var": "q2_contact_when.value"}, { "var": "q4_symptoms_when.value"}]}, 14] },
              'HIGH_RISK',
              { "if": [
                { "and": [
                  // Mind. 1 Atemwegssympthom
                  // TODO: If we have multiple items in that group, we can switch to an "in" oprator.
                  { "some": [{ "var": "q2_symptoms.value" }, { "==": [{ "var": "" }, "respiratory"] }]},
                  { "some": [{ "var": "q2_symptoms.value" }, { "==": [{ "var": "" }, "general"] }]},
                  { "or": [
                    { "var": "q5_risk_factors.value"},
                    { "var": "q6_chronic_afflictions.value"}
                  ]}
                ]},
                'MEDIUM_RISK_A',
                'MISSING', // This else branch is missing in the example
              ]}
            ]},
            { "if": [
              // Use variable defined above
              { "var": "v_contact_relevant" },
              'MEDIUM_RISK_B',
              'NO_RISK'
            ]}
          ]},
          { "if": [
            {"var": "v_symptoms_relevant" },
            { "if": [
              // TODO: Ask Alex how "Score" should work
              { "in": [{ "var": "q2_symptoms.value" }, ["respiratory"]] },
              'MEDIUM_RISK_B',
              'NO_RISK'
            ]},
            'MISSING' // This else branch is missing in the example
          ]}
        ]
      }
    }
  ],
  // Texts can be omitted - just for illustration here.
  resultCategories: [
    // Result category for risk estimation.
    {
      id: 'rc_risk',
      description: 'Risikoeinschätzung',
      results: [
        {
          id: 'MEDIUM_RISK_A',
          text: 'Mittleres Risiko',
          // Tie result to variable from above.
          value: { "==": [{ "var": "v0_risk" }, 'MEDIUM_RISK_A'] }
        },
        {
          id: 'MEDIUM_RISK_B',
          text: 'Mittleres Risiko',
          // Tie result to variable from above.
          value: { "==": [{ "var": "v0_risk" }, 'MEDIUM_RISK_B'] }
        },
        {
          id: 'HIGH_RISK',
          text: 'Hohes Risiko',
          // Tie result to variable from above.
          value: { "==": [{ "var": "v0_risk" }, 'HIGH_RISK'] }
        }
      ]
    },
    // Result category for medical staff advisory.
    {
      id: 'rc_medical_advisory',
      description: 'Medizinischer Leitfaden',
      // Just one (or none) result
      results: [{
        id: 'SHOW_MEDICAL_ADVISORY',
        text: 'Hilfreiche Information.',
        // This is enough, since the question is only shown when we have risk anyway.
        value: { "var": "q6_medical_staff.value" }
      }],
    },
    // Result category for contact advisory.
    {
      id: 'rc_contact_irrelevant',
      description: 'Kontakt',
      // Just one (or none) result
      results: [{
        id: 'SHOW_CONTACT_ADVISORY',
        text: 'Der Kontakt war irrellevant.',
        value: { "and": [
          { "var": "q0_contact.value" },
          { "!": { "var": "v_contact_relevant" }}
        ]}
      }],
    }
  ]
}

// To generate the example JSON.
import { writeFileSync } from 'fs'
writeFileSync('example.json', JSON.stringify(example, undefined, 2))
