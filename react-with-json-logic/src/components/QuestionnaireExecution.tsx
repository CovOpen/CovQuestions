import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography, makeStyles, createStyles } from "@material-ui/core";
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

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    paddingRight: {
      paddingLeft: 12,
    },
  })
);

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({
  isJsonInvalid,
  currentQuestionnaire,
}) => {
  const [questionnaireEngine, setQuestionnaireEngine] = useState(new QuestionnaireEngine(currentQuestionnaire));
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [result, setResult] = useState<Result[] | undefined>(undefined);
  const [doRerender, setDoRerender] = useState(false);

  const classes = useStyles();

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
    <div className={classes.root}>
      <Grid item xs={12} className={`${classes.paddingRight} grid-row`}>
        <Button onClick={restartQuestionnaire} variant="contained" color="secondary">
          Restart Questionnaire
        </Button>
      </Grid>
      {isJsonInvalid ? (
        <Grid item xs={12} className={`${classes.paddingRight} grid-row`}>
          <Alert severity="warning">Cannot load questionnaire. JSON is invalid!</Alert>
        </Grid>
      ) : null}
      <Grid item xs={12} className={`${classes.paddingRight} grid-row`}>
        {result === undefined && currentQuestion ? (
          <QuestionComponent currentQuestion={currentQuestion} handleNextClick={handleNextClick} />
        ) : null}
        {result !== undefined ? <ResultComponent result={result} /> : null}
      </Grid>
      <Grid item xs={12} className={`${classes.paddingRight} grid-row`}>
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
    </div>
  );
};
