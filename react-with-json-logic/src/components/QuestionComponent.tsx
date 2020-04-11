import React, { useEffect, useState } from "react";
import { Question, Questionnaire } from "../logic/questionnaire";
import { Button, Grid, Paper } from "@material-ui/core";
import { QuestionFormComponent } from "./questionComponents/QuestionFormComponent";
import { Alert } from "@material-ui/lab";

type QuestionComponentProps = {
  currentQuestion: Question;
  questionnaireLogic: Questionnaire;
  handleNextClick: () => void;
};

export const QuestionComponent: React.FC<QuestionComponentProps> = ({
  questionnaireLogic,
  currentQuestion,
  handleNextClick,
}) => {
  const [showAnswerIsRequired, setShowAnswerIsRequired] = useState(false);

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

  return (
    <Paper style={{ padding: "20px" }}>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <QuestionFormComponent currentQuestion={currentQuestion} onChange={handleChangeInForm} />
        </Grid>
        {showAnswerIsRequired ? <Alert severity="error">Answer is required for this question.</Alert> : null}
        <Grid item xs>
          <Button onClick={next} variant="contained" color="primary">
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
