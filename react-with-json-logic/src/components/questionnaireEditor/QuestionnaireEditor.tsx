import {
  Button,
  Grid,
  ListItemText,
  Snackbar,
  Divider,
  ListItem,
  List,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import { IQuestionnaire, IQuestionnaireMeta, IQuestion, IResultCategory, IVariable } from "../../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
import { ElementEditor } from "./ElementEditor";

type QuestionnaireEditorProps = {
  value: IQuestionnaire | undefined;
  onChange: () => void;
  resetQuestionnaire: () => void;
  loadQuestionnaire: (newQuestionnaire: IQuestionnaire) => void;
};

type Selection = {
  type: string;
  index?: number;
};

const drawerWidth = 240;
const formHeight = "calc(100vh - 230px)";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectionList: {
      width: "100%",
    },
    selectionListDivider: {
      width: "100%",
    },
    formContainer: {
      paddingLeft: "10px",
      height: formHeight,
    },
    wrapper: {
      margin: 0,
    },
    selection: {
      height: formHeight,
      overflowY: "auto",
      overflowX: "hidden",
    },
    listItem: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: "2px",
      paddingBottom: "2px",
    }
  })
);

export function QuestionnaireEditor(props: QuestionnaireEditorProps) {
  const classes = useStyles();

  const [activeSelection, setActiveSelection] = useState<Selection>({ type: "meta" });
  const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>({} as IQuestionnaire);
  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);
  const [questionnaireSchema, setQuestionnaireSchema] = useState<jsonschema.Schema | undefined>(undefined);

  const style = `
  .MuiTabs-root, .MuiTabs-scroller, .MuiTabs-flexContainer {
    margin: 0;
  }
  .rjsf > .MuiFormControl-root {
    height: ${formHeight};
    overflow-x: hidden !important;
    overflow-x: auto;
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

  const handleResultCategoryChanged = (index: number, value: IResultCategory) => {
    questionnaire.resultCategories[index] = value;
  };

  const handleVariableChanged = (index: number, value: IVariable) => {
    questionnaire.variables[index] = value;
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
    <Grid container direction="column" className={classes.wrapper}>
      <style>{style}</style>
      <Grid container className={classes.wrapper}>
        <Grid container item xs={12} justify="flex-end">
          <Button onClick={props.resetQuestionnaire} variant="contained" color="secondary">
            Reset Questionnaire
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column">
          <Grid container>
            <Grid container item xs={3} className={classes.selection}>
              <List className={classes.selectionList}>
                <ListItem
                  className={classes.listItem}
                  button
                  selected={activeSelection.type === "meta"}
                  onClick={() => setActiveSelection({ type: "meta", index: 0 })}
                >
                  <ListItemText primary="Meta" />
                </ListItem>
              </List>
              <Divider className={classes.selectionListDivider} />
              <List className={classes.selectionList}>
                {questionnaire.questions !== undefined
                  ? questionnaire.questions.map((item, index) => (
                      <ListItem
                        button
                        className={classes.listItem}
                        selected={activeSelection.type === "question" && activeSelection.index === index}
                        onClick={() => setActiveSelection({ type: "question", index })}
                        key={index}
                      >
                        <ListItemText primary={item.text} />
                      </ListItem>
                    ))
                  : null}
                <ListItem className={classes.listItem}>
                  <Button variant="contained" color="secondary">
                    Add Question
                  </Button>
                </ListItem>
              </List>
              <Divider className={classes.selectionListDivider} />
              <List className={classes.selectionList}>
                {questionnaire.resultCategories !== undefined
                  ? questionnaire.resultCategories.map((item, index) => (
                      <ListItem
                        button
                        className={classes.listItem}
                        selected={activeSelection.type === "resultCategory" && activeSelection.index === index}
                        onClick={() => setActiveSelection({ type: "resultCategory", index })}
                        key={index}
                      >
                        <ListItemText primary={item.id} />
                      </ListItem>
                    ))
                  : null}
                <ListItem className={classes.listItem}>
                  <Button variant="contained" color="secondary">
                    Add Result
                  </Button>
                </ListItem>
              </List>
              <Divider className={classes.selectionListDivider} />
              <List className={classes.selectionList}>
                {questionnaire.variables !== undefined
                  ? questionnaire.variables.map((item, index) => (
                      <ListItem
                        button
                        className={classes.listItem}
                        selected={activeSelection.type === "variable" && activeSelection.index === index}
                        onClick={() => setActiveSelection({ type: "variable", index })}
                        key={index}
                      >
                        <ListItemText primary={item.id} />
                      </ListItem>
                    ))
                  : null}
                <ListItem className={classes.listItem}>
                  <Button variant="contained" color="secondary">
                    Add Variable
                  </Button>
                </ListItem>
              </List>
            </Grid>
            <Grid container item xs={9} className={classes.formContainer}>
              {activeSelection.type === "meta" ? (
                <ElementEditor
                  schemaUrl="api/schema/questionnaireMeta.json"
                  value={questionnaire.meta || ({} as IQuestionnaireMeta)}
                  onChange={(value) => handleQuestionnaireMetaChanged(value as IQuestionnaireMeta)}
                />
              ) : null}
              {activeSelection.type === "question" &&
              activeSelection.index !== undefined &&
              questionnaire.questions !== undefined ? (
                <ElementEditor
                  schemaUrl="api/schema/question.json"
                  value={questionnaire.questions[activeSelection.index]}
                  onChange={(value) => handleQuestionChanged(activeSelection.index || -1, value as IQuestion)}
                />
              ) : null}
              {activeSelection.type === "resultCategory" &&
              activeSelection.index !== undefined &&
              questionnaire.resultCategories !== undefined ? (
                <ElementEditor
                  schemaUrl="api/schema/resultCategory.json"
                  value={questionnaire.resultCategories[activeSelection.index]}
                  onChange={(value) =>
                    handleResultCategoryChanged(activeSelection.index || -1, value as IResultCategory)
                  }
                />
              ) : null}
              {activeSelection.type === "variable" &&
              activeSelection.index !== undefined &&
              questionnaire.variables !== undefined ? (
                <ElementEditor
                  schemaUrl="api/schema/variable.json"
                  value={questionnaire.variables[activeSelection.index]}
                  onChange={(value) => handleVariableChanged(activeSelection.index || -1, value as IVariable)}
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
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
