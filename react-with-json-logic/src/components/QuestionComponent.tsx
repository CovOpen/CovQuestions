import React, { useEffect, useState } from "react";
import { Question } from "../logic/QuestionnaireEngine";
import { Button, Grid, Paper, makeStyles, createStyles } from "@material-ui/core";
import { QuestionFormComponent } from "./questionComponents/QuestionFormComponent";
import { Alert } from "@material-ui/lab";
import { Primitive } from "../Primitive";

type QuestionComponentProps = {
  currentQuestion: Question;
  handleNextClick: (value: Primitive | Array<Primitive> | undefined) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: "#F7FAFC",
      border: "1.5px solid #CBD5E0",
      borderRadius: 6,
      boxSizing: "border-box",
      boxShadow: "none",
      padding: 20,
    },
  })
);

export const QuestionComponent: React.FC<QuestionComponentProps> = ({ currentQuestion, handleNextClick }) => {
  const [currentValue, setCurrentValue] = useState<Primitive | Array<Primitive> | undefined>(undefined);
  const [showAnswerIsRequired, setShowAnswerIsRequired] = useState(false);

  const classes = useStyles();

  const handleChangeInForm = (value: any) => {
    setCurrentValue(value);
    if (value === undefined && !currentQuestion.isOptional()) {
      setShowAnswerIsRequired(true);
      return;
    }
    setShowAnswerIsRequired(false);
  };

  const next = () => {
    if (currentValue === undefined && !currentQuestion.isOptional()) {
      setShowAnswerIsRequired(true);
      return;
    }
    handleNextClick(currentValue);
  };

  useEffect(() => {
    setShowAnswerIsRequired(false);
  }, [currentQuestion]);

  return (
    <Paper className={classes.root}>
      <Grid container direction="column" alignItems="stretch">
        <Grid item xs={12}>
          <QuestionFormComponent currentQuestion={currentQuestion} onChange={handleChangeInForm} />
        </Grid>
        {showAnswerIsRequired ? <Alert severity="error">Answer is required for this question.</Alert> : null}
        <Grid container item xs={12} justify="flex-end">
          <Grid item>
            <Button onClick={next} variant="contained" color="primary">
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
