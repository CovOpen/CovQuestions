import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { QuestionForm } from "./QuestionForm";
import { Questionnaire, Question, Result } from "../logic/questionnaire";

export function QuestionnaireExecution({
  currentQuestion,
  questionnaireLogic,
  handleNextClick,
  result,
  restartQuestionnaire,
  isInSync,
}: {
  currentQuestion: Question;
  questionnaireLogic: Questionnaire;
  handleNextClick: () => void;
  result?: Result[];
  restartQuestionnaire: () => void;
  isInSync: boolean;
}) {
  const [showAnswerIsRequired, setShowAnswerIsRequired] = useState(undefined);

  const handleChangeInForm = (value: any) => {
    questionnaireLogic.setAnswer(currentQuestion.id, value);
    const hasAnswer = questionnaireLogic.hasAnswer(currentQuestion.id);
    if (hasAnswer) {
      setShowAnswerIsRequired(false);
    }
    if (!hasAnswer && !currentQuestion.isOptional()) {
      setShowAnswerIsRequired(true);
    }
  };

  const next = () => {
    const hasAnswer = questionnaireLogic.hasAnswer(currentQuestion.id);
    if (!hasAnswer && !currentQuestion.isOptional()) {
      setShowAnswerIsRequired(true);
      return;
    }
    handleNextClick();
  };

  useEffect(() => {
    setShowAnswerIsRequired(false);
  }, [currentQuestion]);

  if (!result && !currentQuestion) {
    return null;
  }

  return (
    <>
      <Grid item xs={9}>
        <Button
          onClick={restartQuestionnaire}
          variant="contained"
          color="secondary"
        >
          Restart Questionnaire
        </Button>
      </Grid>
      {!isInSync ? (
        <Grid item xs={9}>
          <Alert severity="warning">
            This questionnaire is out of sync. Please reload.
          </Alert>
        </Grid>
      ) : null}
      <Grid item xs={9}>
        {result === undefined ? (
          <Paper style={{ padding: "20px" }}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs>
                <QuestionForm
                  currentQuestion={currentQuestion}
                  onChange={handleChangeInForm}
                />
              </Grid>
              {showAnswerIsRequired ? (
                <Alert severity="error">
                  Answer is required for this question.
                </Alert>
              ) : null}
              <Grid item xs>
                <Button onClick={next} variant="contained" color="primary">
                  Next
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper style={{ color: "red", padding: "20px" }}>
            {result.length > 0 ? (
              result.map((it) => (
                <Typography>
                  {it.resultCategory.description}: {it.result.text}
                </Typography>
              ))
            ) : (
              <Typography>No result applies</Typography>
            )}
          </Paper>
        )}
      </Grid>
      <Grid item xs={9}>
        <Typography>Current internal state:</Typography>
        <Paper>
          <Box style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              questionnaireLogic.getDataObjectForDeveloping(),
              null,
              2
            )}
          </Box>
        </Paper>
      </Grid>
    </>
  );
}
