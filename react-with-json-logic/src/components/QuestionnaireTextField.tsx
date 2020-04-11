import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Alert } from "@material-ui/lab";

type QuestionnaireTextFieldProps = {
  value: unknown;
  onChange: () => void;
  resetQuestionnaire: (e) => void;
  loadQuestionnaire: (e) => void;
};

export function QuestionnaireTextField(props: QuestionnaireTextFieldProps) {
  const [questionnaireAsString, setQuestionnaireAsString] = useState(undefined);
  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);

  const updateQuestionnaire = () => {
    try {
      const json = JSON.parse(questionnaireAsString);
      props.loadQuestionnaire(json);
    } catch (e) {
      setShowJsonInvalidMessage(true);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowJsonInvalidMessage(false);
  };

  useEffect(() => {
    setQuestionnaireAsString(props.value);
  }, [props.value]);

  return (
    <Grid container direction="column">
      <Grid container>
        <Grid item xs={6}>
          <Button
            onClick={updateQuestionnaire}
            variant="contained"
            color="secondary"
          >
            Load Questionnaire
          </Button>
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <Button
            onClick={props.resetQuestionnaire}
            variant="contained"
            color="secondary"
          >
            Reset Questionnaire
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="questionnaire-json-text-field"
          multiline
          rows="20"
          variant="outlined"
          fullWidth={true}
          value={questionnaireAsString}
          onChange={(e) => {
            setQuestionnaireAsString(e.target.value);
            props.onChange();
          }}
        />
      </Grid>

      <Snackbar
        open={showJsonInvalidMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          Cannot load questionnaire. JSON is invalid!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
