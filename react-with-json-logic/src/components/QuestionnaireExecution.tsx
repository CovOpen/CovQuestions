import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Question, Questionnaire, Result } from "../logic/questionnaire";
import { ResultComponent } from "./ResultComponent";
import { QuestionComponent } from "./QuestionComponent";

type QuestionnaireExecutionProps = {
  currentQuestion: Question | undefined;
  questionnaireLogic: Questionnaire;
  handleNextClick: () => void;
  result?: Result[];
  restartQuestionnaire: () => void;
  isInSync: boolean;
};

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({
  currentQuestion,
  questionnaireLogic,
  handleNextClick,
  result,
  restartQuestionnaire,
  isInSync,
}) => {
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
        {result === undefined && currentQuestion !== undefined ? (
          <QuestionComponent
            currentQuestion={currentQuestion}
            questionnaireLogic={questionnaireLogic}
            handleNextClick={handleNextClick}
          />
        ) : null}
        {result !== undefined ? <ResultComponent result={result} /> : null}
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
};
