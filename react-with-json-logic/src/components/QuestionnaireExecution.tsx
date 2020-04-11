import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { QuestionForm } from "./QuestionForm";
import { IQuestion } from "../logic/schema";
import { Questionnaire, Result } from "../logic/questionnaire";

export function QuestionnaireExecution({
  currentQuestion,
  questionnaireLogic,
  handleNextClick,
  result,
  restartQuestionnaire,
  isInSync,
}: {
  currentQuestion: IQuestion;
  questionnaireLogic: Questionnaire;
  handleNextClick: () => void;
  result?: Result[];
  restartQuestionnaire: () => void;
  isInSync: boolean;
}) {
  const handleChangeInForm = (value: any) => {
    questionnaireLogic.setAnswer(currentQuestion.id, value);
  };

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
              <Grid item xs>
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
