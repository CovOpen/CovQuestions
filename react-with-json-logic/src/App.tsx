import React, { Reducer, useReducer, useState } from "react";
import jsonLogic from "json-logic-js";
import "./App.css";
import questionnaire from "./exampleWithJsonLogic.json";
import { QuestionForm } from "./components/QuestionForm";

export type Question = {
  id: string;
  category: string;
  type: string;
  question: string;
};

export type QuestionWithValues = Question & {
  possibleAnswers: [
    {
      label: string;
      value: string;
      score: number;
    }
  ];
};

function getCategories(answers: any) {
  const categories = {};
  for (const answerId in answers) {
    const question = questionnaire.questions.find((it) => it.id === answerId);
    const possibleAnswers = question?.possibleAnswers;
    if (possibleAnswers !== undefined) {
      categories[question.category] =
        (categories[question.category] ?? 0) +
        possibleAnswers.find((it) => it.value === answers[answerId]).score;
    }
  }
  return categories;
}

function getVariables(state: any) {
  const variables = {};
  questionnaire.variables.forEach((variable) => {
    variables[variable.id] = jsonLogic.apply(variable.value, state);
  });
  return variables;
}

type AppState = { questions: any; categories: any; variables: any };
type AppAction = { questionId?: string; response?: string; type?: string };
const initialAppState = { questions: {}, categories: {}, variables: {} };

const reducer: Reducer<AppState, AppAction> = (state, action) => {
  if (action.type === "reset") {
    return { questions: {}, categories: {}, variables: {} };
  }
  state.questions[action.questionId] = action.response;
  state.categories = getCategories(state.questions);
  state.variables = getVariables(state);
  return state;
};

function findNextStep(state, currentStep: number) {
  const nextIndex = questionnaire.questions.findIndex((question, index) => {
    if (index <= currentStep) {
      return false;
    }
    return jsonLogic.apply(question.visibleIf, state);
  });
  return nextIndex === -1 ? undefined : nextIndex;
}

const App = () => {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialAppState);
  const [result, setResult] = useState(undefined);

  const currentQuestion = questionnaire.questions[step];

  const handleNextClick = () => {
    const nextStep = findNextStep(state, step);
    if (nextStep) {
      setStep(nextStep);
    } else {
      setComplete(true);
      showResult();
    }
  };

  const handleChangeInForm = (value: any) => {
    dispatch({
      questionId: currentQuestion.id,
      response: value,
    });
  };

  const showResult = () => {
    const matchingResult = questionnaire.interpretation.find(
      (it) => it.visibleIf === undefined || jsonLogic.apply(it.visibleIf, state)
    );
    setResult(matchingResult ? matchingResult.text : "Sorry, no result found.");
  };

  const resetApp = () => {
    setStep(0);
    setComplete(false);
    setResult(undefined);
    dispatch({ type: "reset" });
  };

  return (
    <div className="App">
      <div>
        <button onClick={resetApp}>Reset Questionnaire</button>
      </div>
      {complete ? (
        <div> Done </div>
      ) : (
        <div>
          <QuestionForm
            currentQuestion={currentQuestion}
            onChange={handleChangeInForm}
          />
          <div>
            <button onClick={handleNextClick}>Next</button>
          </div>
        </div>
      )}
      {result ? <div style={{ color: "red" }}>Result: {result}</div> : null}
      <div>Current internal state:</div>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(state, null, 2)}
      </div>
    </div>
  );
};

export default App;
