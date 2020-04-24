import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Question, QuestionnaireEngine, Result } from "../logic/QuestionnaireEngine";
import { ResultComponent } from "./ResultComponent";
import { QuestionComponent } from "./QuestionComponent";
import { Questionnaire } from "../models/Questionnaire";
import { Primitive } from "../Primitive";

type QuestionnaireExecutionProps = {
  isJsonInvalid?: boolean;
  currentQuestionnaire: Questionnaire;
};

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({
  isJsonInvalid,
  currentQuestionnaire,
}) => {
  const [questionnaireEngine, setQuestionnaireEngine] = useState(new QuestionnaireEngine(currentQuestionnaire));
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [result, setResult] = useState<Result[] | undefined>(undefined);
  const [doRerender, setDoRerender] = useState(false);

  function restartQuestionnaire() {
    const engine = new QuestionnaireEngine(currentQuestionnaire);
    const nextQuestion = engine.nextQuestion();

    setResult(undefined);
    setQuestionnaireEngine(engine);
    setCurrentQuestion(nextQuestion);
    setDoRerender(true);
  }

  function handleNextClick(value: Primitive | Array<Primitive> | undefined) {
    questionnaireEngine.setAnswer(currentQuestion!.id, value);

    const nextQuestion = questionnaireEngine.nextQuestion();
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setCurrentQuestion(undefined);
      setResult(questionnaireEngine.getResults());
    }
  }

  useEffect(restartQuestionnaire, [currentQuestionnaire]);

  useEffect(() => {
    if (doRerender) {
      setDoRerender(false);
    }
  }, [doRerender]);

  return doRerender ? (
    <></>
  ) : (
    <>
      <Grid item xs={9} className="grid-row">
        <Button onClick={restartQuestionnaire} variant="contained" color="secondary">
          Restart Questionnaire
        </Button>
      </Grid>
      {isJsonInvalid ? (
        <Grid item xs={9} className="grid-row">
          <Alert severity="warning">Cannot load questionnaire. JSON is invalid!</Alert>
        </Grid>
      ) : null}
      <Grid item xs={9} className="grid-row">
        {result === undefined && currentQuestion ? (
          <QuestionComponent currentQuestion={currentQuestion} handleNextClick={handleNextClick} />
        ) : null}
        {result !== undefined ? <ResultComponent result={result} /> : null}
      </Grid>
      <Grid item xs={9} className="grid-row">
        {questionnaireEngine ? (
          <>
            <Typography>Current internal state:</Typography>
            <Paper>
              <Box style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(questionnaireEngine.getDataObjectForDeveloping(), null, 2)}
              </Box>
            </Paper>
          </>
        ) : null}
      </Grid>
    </>
  );
};
