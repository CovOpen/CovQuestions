import { Button, Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";

export function QuestionnaireTextField(props: {
  value: unknown;
  onChange: (e) => void;
  resetQuestionnaire: (e) => void;
  loadQuestionnaire: (e) => void;
}) {
  const [questionnaire, setQuestionnaire] = useState(undefined);

  useEffect(() => {
    setQuestionnaire(props.value);
  }, [props.value]);

  function changeQuestionnaire(e: any) {
    setQuestionnaire(JSON.parse(e.target.value));
    props.onChange(e);
  }

  return (
    <Grid container direction="column">
      <Grid container>
        <Grid item xs={6}>
          <Button
            onClick={() => props.loadQuestionnaire(questionnaire)}
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
          value={JSON.stringify(questionnaire, null, 2)}
          onChange={(e) => {
            setQuestionnaire(JSON.parse(e.target.value));
            props.onChange(e);
          }}
        />
      </Grid>
    </Grid>
  );
}
