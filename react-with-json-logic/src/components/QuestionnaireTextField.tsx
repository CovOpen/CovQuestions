import { Button, Grid, ListItemText, Snackbar, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import { IQuestionnaire } from "../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";

type QuestionnaireTextFieldProps = {
  value: string;
  schema: jsonschema.Schema | undefined;
  onChange: () => void;
  resetQuestionnaire: () => void;
  loadQuestionnaire: (newQuestionnaire: IQuestionnaire) => void;
};

export function QuestionnaireTextField(props: QuestionnaireTextFieldProps) {
  const [questionnaireAsString, setQuestionnaireAsString] = useState("");
  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);

  const updateQuestionnaire = () => {
    setSchemaValidationErrors([]);
    try {
      const json = JSON.parse(questionnaireAsString);
      if (props.schema !== undefined) {
        const validator = new jsonschema.Validator();
        const validationResult = validator.validate(json, props.schema as jsonschema.Schema);
        if (validationResult.errors.length > 0) {
          setSchemaValidationErrors(validationResult.errors);
          setShowJsonInvalidMessage(true);
          return;
        }
      }
      props.loadQuestionnaire(json);
    } catch (e) {
      setShowJsonInvalidMessage(true);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setShowJsonInvalidMessage(false);
  };

  const downloadJson = () => {
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([questionnaireAsString], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = JSON.parse(questionnaireAsString).id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  };

  useEffect(() => {
    setQuestionnaireAsString(props.value);
  }, [props.value]);

  return (
    <Grid container direction="column">
      <Grid container>
        <Grid item xs={6}>
          <Button onClick={updateQuestionnaire} variant="contained" color="secondary">
            Load Questionnaire
          </Button>
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
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
      <Grid container item xs={12} justify="flex-end">
        <Button onClick={downloadJson} variant="contained" color="primary">
          Download Questionnaire
        </Button>
      </Grid>

      {schemaValidationErrors.length > 0 ? (
        <Grid item xs={12}>
          <Alert severity="error">
            Errors while validating JSON schema.
            {schemaValidationErrors.map((error, index) => (
              <ListItemText key={index} primary={error.message} />
            ))}
          </Alert>
        </Grid>
      ) : null}

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
