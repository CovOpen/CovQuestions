import { Button, Grid, TextField } from "@material-ui/core";
import React from "react";

export function QuestionnaireTextField(props: {
  value: unknown;
  onChange: (e) => void;
  resetQuestionnaire: (e) => void;
}) {
  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <Button
          onClick={props.resetQuestionnaire}
          variant="contained"
          color="secondary"
        >
          Reset Questionnaire
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="questionnaire-json-text-field"
          multiline
          rows="20"
          variant="outlined"
          fullWidth={true}
          value={JSON.stringify(props.value, null, 2)}
          onChange={(e) => props.onChange(JSON.parse(e.target.value))}
        />
      </Grid>
    </Grid>
  );
}
