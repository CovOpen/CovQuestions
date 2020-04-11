import { Button, Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";

export function QuestionnaireTextField(props: {
  value: unknown;
  onChange: () => void;
  resetQuestionnaire: (e) => void;
  loadQuestionnaire: (e) => void;
}) {
  const [questionnaireAsString, setQuestionnaireAsString] = useState(undefined);

  const updateQuestionnaire = () => {
      var json = JSON.parse(questionnaireAsString);
      props.loadQuestionnaire(json);
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
    </Grid>
  );
}
