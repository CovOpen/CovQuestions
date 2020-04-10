import React, { Reducer, useReducer, useState } from "react";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { QuestionForm } from "./QuestionForm";
import jsonLogic from "json-logic-js";

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
type AppState = { questions: any; categories: any; variables: any };
type AppAction = { questionId?: string; response?: string; type?: string };
const initialAppState = { questions: {}, categories: {}, variables: {} };

export function QuestionnaireExecution({
  questionnaire,
}: {
  questionnaire: any;
}) {
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

  const reducer: Reducer<AppState, AppAction> = (state, action) => {
    if (action.type === "reset") {
      return { questions: {}, categories: {}, variables: {} };
    }
    state.questions[action.questionId] = action.response;
    state.categories = getCategories(state.questions);
    state.variables = getVariables(state);
    return state;
  };

  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialAppState);
  const [result, setResult] = useState(undefined);

  const currentQuestion = questionnaire.questions[step];

  function findNextStep(state, currentStep: number) {
    const nextIndex = questionnaire.questions.findIndex((question, index) => {
      if (index <= currentStep) {
        return false;
      }
      return jsonLogic.apply(question.visibleIf, state);
    });
    return nextIndex === -1 ? undefined : nextIndex;
  }

  function getVariables(state: any) {
    const variables = {};
    questionnaire.variables.forEach((variable) => {
      variables[variable.id] = jsonLogic.apply(variable.value, state);
    });
    return variables;
  }

  const handleNextClick = () => {
    const nextStep = findNextStep(state, step);
    if (nextStep) {
      setStep(nextStep);
    } else {
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
    setResult(undefined);
    dispatch({ type: "reset" });
  };

  return (
    <>
      <Grid item xs={6}>
        <Button onClick={resetApp} variant="contained" color="secondary">
          Reset Questionnaire
        </Button>
      </Grid>
      <Grid item xs={9}>
        {!result ? (
          <Paper style={{ padding: "20px" }}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <QuestionForm
                  currentQuestion={currentQuestion}
                  onChange={handleChangeInForm}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={handleNextClick}
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper style={{ color: "red", padding: "20px" }}>
            <Typography>{result}</Typography>
          </Paper>
        )}
      </Grid>
      <Grid item xs={9}>
        <div>Current internal state:</div>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, 2)}
        </div>
      </Grid>
    </>
  );
}
