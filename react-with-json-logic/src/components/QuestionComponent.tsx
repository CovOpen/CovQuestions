import React, { useEffect, useState } from "react";
import { Question } from "../logic/questionnaire";
import { Button, Grid, Paper } from "@material-ui/core";
import { QuestionFormComponent } from "./questionComponents/QuestionFormComponent";
import { Alert } from "@material-ui/lab";
import { Primitive } from "../Primitive";

type QuestionComponentProps = {
  currentQuestion: Question;
  handleNextClick: (value: Primitive | Array<Primitive> | undefined) => void;
};

export const QuestionComponent: React.FC<QuestionComponentProps> = ({ currentQuestion, handleNextClick }) => {
  const [currentValue, setCurrentValue] = useState<Primitive | Array<Primitive> | undefined>(undefined);
  const [showAnswerIsRequired, setShowAnswerIsRequired] = useState(false);

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
    <Paper style={{ padding: "20px" }}>
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
