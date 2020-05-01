# Covquestions Questionaire Logic

This package (`covquestions-js`) provides models, state handling and evaluation logic for a questionaire.

An API client for accessing the covquestions API will be included in the future.

## Usage

Basic example:

```typescript
// currentQuestionaire is simply a questionaire file, as Javascript Object.

const engine = new QuestionnaireEngine(currentQuestionnaire);

// Until the questionaire is finished, get the next question and set the answer:
const nextQuestion = engine.nextQuestion();
questionnaireEngine.setAnswer(currentQuestion!.id, value);

// If nextQuestion is undefined, the questionaire is finished. Get and show results.
questionnaireEngine.getResults();
```

For a usage example with react, please refer to our questionarie reference implementation.

## Usage during active development

In this directory, execute `yarn link`. In the typescript project, where the package is to be used, execute `yarn link covquestions-js`.

This will link against the uncompiled typescript files, updates will be propagated without building.
