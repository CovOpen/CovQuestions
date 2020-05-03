import { expectGen, expectE2E } from "./common";

// ADditional test cases from the original covapp.

describe("Covapp example logic", () => {
  expectGen(
    {
      and: [
        {
          var: "v_symptoms.value",
        },
        {
          var: "v_contact.value",
        },
        {
          var: "v_symptoms_after_contact.value",
        },
      ],
    },
    "v_symptoms.value and v_contact.value and v_symptoms_after_contact.value"
  );

  expectGen(
    {
      and: [
        {
          var: "v_contact_relevant.value",
        },
        {
          "!": {
            var: "v_symptoms.value",
          },
        },
      ],
    },
    "v_contact_relevant.value and !v_symptoms.value"
  );

  expectGen(
    {
      and: [
        {
          "!": {
            var: "v_symptoms.value",
          },
        },
        {
          "!": {
            var: "v_contact.value",
          },
        },
      ],
    },
    "!v_symptoms.value and !v_contact.value"
  );

  expectGen(
    {
      "==": [
        {
          var: "q4_work.value",
        },
        "medical",
      ],
    },
    'q4_work.value == "medical"'
  );

  expectGen(
    {
      and: [
        {
          var: "q8_contact_date.value",
        },
        {
          "!": {
            var: "v_contact_relevant",
          },
        },
        {
          "!": {
            var: "v_symptoms",
          },
        },
      ],
    },
    "q8_contact_date.value and !v_contact_relevant and !v_symptoms"
  );

  expectE2E(
    "v_symptoms.value and v_contact.value and v_symptoms_after_contact.value",
    "v_symptoms.value and v_contact.value and v_symptoms_after_contact.value"
  );

  expectE2E(
    "v_contact_relevant.value and !v_symptoms.value",
    "v_contact_relevant.value and !v_symptoms.value"
  );
  expectE2E(
    "!v_symptoms.value and !v_contact.value",
    "!v_symptoms.value and !v_contact.value"
  );
  expectE2E('q4_work.value == "medical"', 'q4_work.value == "medical"');
  expectE2E(
    "q8_contact_date.value and !v_contact_relevant and !v_symptoms",
    "q8_contact_date.value and !v_contact_relevant and !v_symptoms"
  );
});
