import React, { useEffect, useState } from "react";
import { Box, Button, createStyles, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Primitive, Question, Questionnaire, QuestionnaireEngine, Result } from "@covopen/covquestions-js";
import { ResultComponent } from "./ResultComponent";
import { QuestionComponent } from "./QuestionComponent";
import "typeface-fira-sans";

type QuestionnaireExecutionProps = {
  currentQuestionnaire: Questionnaire;
  isJsonInvalid: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    padding: {
      padding: "10px 12px",
    },
    execution: {
      overflow: "auto",
      minHeight: "500px",
    },
    internalState: {
      backgroundColor: "#F7FAFC",
      border: "1.5px solid #CBD5E0",
      borderRadius: 6,
      boxSizing: "border-box",
      boxShadow: "none",
      fontFamily: "Fira Sans",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: "0.1rem",
      padding: 10,
      opacity: 0.6,
      overflow: "auto",
      flex: 1,
    },
    internalStateHeadline: {
      color: "#A0AEC0",
      fontFamily: "Fira Sans",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "17px",
      letterSpacing: "0.1em",
      opacity: 0.8,
      textTransform: "uppercase",
      margin: "auto",
      "margin-bottom": 0,
      "margin-left": 0,
    },
  })
);

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({
  currentQuestionnaire,
  isJsonInvalid,
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
    <Grid container direction="column" justify="space-between" className={`${classes.padding} overflow-pass-through`}>
      <Grid item className={`${classes.execution}`}>
        <Typography className={classes.internalStateHeadline}>Questionnaire Preview</Typography>
        {isJsonInvalid ? <Alert severity="warning">Cannot load questionnaire. JSON is invalid!</Alert> : null}
        {result === undefined && currentQuestion ? (
          <QuestionComponent currentQuestion={currentQuestion} handleNextClick={handleNextClick} />
        ) : null}
        {result !== undefined ? <ResultComponent result={result} /> : null}
      </Grid>
      {questionnaireEngine ? (
        <Grid item container direction="column" className="overflow-pass-through">
          <Grid item container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.internalStateHeadline}>Internal state</Typography>
            </Grid>
            <Grid item>
              <Button onClick={restartQuestionnaire} variant="contained" color="secondary">
                Restart Questionnaire
              </Button>
            </Grid>
          </Grid>
          <Grid item container xs={12} className="overflow-pass-through">
            <Paper className={classes.internalState}>
              <Box style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>
                {JSON.stringify(questionnaireEngine.getDataObjectForDeveloping(), null, 2)}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
};
