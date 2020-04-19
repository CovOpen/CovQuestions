import { Button, Grid, ListItemText, Snackbar, AppBar, Tabs, Tab, Typography } from "@material-ui/core";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Alert } from "@material-ui/lab";
import { IQuestionnaire, IQuestionnaireMeta, IQuestion } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import { QuestionnaireMetaEditor } from "./QuestionnaireMetaEditor";
import { QuestionEditor } from "./QuestionEditor";

type QuestionnaireEditorProps = {
  value: IQuestionnaire | undefined;
  onChange: () => void;
  resetQuestionnaire: () => void;
  loadQuestionnaire: (newQuestionnaire: IQuestionnaire) => void;
};

export function QuestionnaireEditor(props: QuestionnaireEditorProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>({} as IQuestionnaire);
  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);
  const [questionnaireSchema, setQuestionnaireSchema] = useState<jsonschema.Schema | undefined>(undefined);

  const style = `
  .MuiTabs-root, .MuiTabs-scroller, .MuiTabs-flexContainer {
    margin: 0;
  }
  .rjsf > .MuiFormControl-root  {
    height: 600px;
    overflow: auto;
  }
  .rjsf .MuiBox-root {
    padding: 0;
  }
  .rjsf .form-group, .rjsf .panel-body {
    margin: 0;
  }
  `;

  const updateQuestionnaire = () => {
    setSchemaValidationErrors([]);
    if (questionnaire === undefined) {
      return;
    }
    if (questionnaireSchema === undefined) {
      return;
    }
    try {
      const validator = new jsonschema.Validator();
      const validationResult = validator.validate(questionnaire, questionnaireSchema);
      if (validationResult.errors.length > 0) {
        setSchemaValidationErrors(validationResult.errors);
        setShowJsonInvalidMessage(true);
        return;
      }
      props.loadQuestionnaire(questionnaire);
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

  const handleTabChanged = (event: ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const downloadJson = () => {
    if (questionnaire === undefined) {
      return;
    }
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(questionnaire, null, 2)], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = questionnaire.id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  };

  const handleQuestionnaireMetaChanged = (value: IQuestionnaireMeta) => {
    questionnaire.meta = value;
  };

  const handleQuestionChanged = (index: number, value: IQuestion) => {
    questionnaire.questions[index] = value;
  };

  useEffect(() => {
    if (props.value === undefined) {
      setQuestionnaire({} as IQuestionnaire);
    } else {
      setQuestionnaire(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    fetch("api/schema/questionnaire.json").then((response) => {
      if (response.ok) {
        response.json().then((value: jsonschema.Schema) => setQuestionnaireSchema(value));
      }
    });
  }, []);

  return (
    <Grid container direction="column">
      <style>{style}</style>
      <Grid container>
        <Grid container item xs={12} justify="flex-end">
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
            Reset Questionnaire
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <AppBar position="static" color="default">
          <Tabs
            value={activeTab}
            onChange={handleTabChanged}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Meta" />
            {questionnaire.questions !== undefined
              ? questionnaire.questions.map((item, index) => <Tab key={index} label={item.text}></Tab>)
              : null}
          </Tabs>
        </AppBar>
        <Typography
          component="div"
          role="tabpanel"
          hidden={activeTab !== 0}
          id={`scrollable-auto-tabpanel-0`}
          aria-labelledby={`scrollable-auto-tab-0`}
        >
          {activeTab === 0 && (
            <QuestionnaireMetaEditor
              value={questionnaire.meta || ({} as IQuestionnaireMeta)}
              onChange={handleQuestionnaireMetaChanged}
            />
          )}
        </Typography>
        {questionnaire.questions !== undefined
          ? questionnaire.questions.map((item, index) => (
              <Typography
                component="div"
                role="tabpanel"
                hidden={activeTab !== index + 1}
                id={`scrollable-auto-tabpanel-${index + 1}`}
                aria-labelledby={`scrollable-auto-tab-${index + 1}`}
                key={index}
              >
                {activeTab === index + 1 && (
                  <QuestionEditor value={item} onChange={(value) => handleQuestionChanged(index, value)} />
                )}
              </Typography>
            ))
          : null}
      </Grid>
      <Grid item xs={12}>
        <Button onClick={updateQuestionnaire} variant="contained" color="secondary">
          Use as Questionnaire
        </Button>
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
