import { Button, Grid, ListItemText, Snackbar } from "@material-ui/core";
import React, { CSSProperties } from "react";
import { Alert } from "@material-ui/lab";
import { IQuestionnaire } from "../logic/schema";
// @ts-ignore
import jsonschema from "jsonschema";
// @ts-ignore
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

type QuestionnaireEditorProps = {
  value: IQuestionnaire | undefined;
  schema: jsonschema.Schema | undefined;
  onChange: () => void;
  resetQuestionnaire: () => void;
  loadQuestionnaire: (newQuestionnaire: IQuestionnaire) => void;
};

type QuestionnaireEditorState = {
  questionnaire: IQuestionnaire | undefined;
  showJsonInvalidMessage: boolean;
  schemaValidationErrors: jsonschema.ValidationError[];
};

export class QuestionnaireEditor extends React.Component<QuestionnaireEditorProps, QuestionnaireEditorState> {
  private container: HTMLDivElement | null = null;
  private jsoneditor: any;
  private jsonEditorStyle: CSSProperties = {
    width: "95%",
    height: "500px",
  };

  constructor(props: QuestionnaireEditorProps) {
    super(props);
    this.state = {
      questionnaire: props.value,
      showJsonInvalidMessage: false,
      schemaValidationErrors: [],
    };
  }

  public updateQuestionnaire() {
    this.setState({ schemaValidationErrors: [] });
    try {
      if (this.props.schema !== undefined) {
        const validator = new jsonschema.Validator();
        const validationResult = validator.validate(this.state.questionnaire, this.props.schema as jsonschema.Schema);
        if (validationResult.errors.length > 0) {
          this.setState({ schemaValidationErrors: validationResult.errors, showJsonInvalidMessage: true });
          return;
        }
      }
      if (this.state.questionnaire !== undefined) {
        this.props.loadQuestionnaire(this.state.questionnaire);
      }
    } catch (e) {
      this.setState({ showJsonInvalidMessage: true });
    }
  }

  public downloadJson() {
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(this.state.questionnaire, null, 2)], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = this.state.questionnaire?.id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  }

  public handleSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ showJsonInvalidMessage: false });
  }

  componentDidMount() {
    const options = {
      mode: "tree",
      onChangeJSON: (json: IQuestionnaire | undefined) => this.onChangeJSON(json),
    };

    this.jsoneditor = new JSONEditor(this.container, options);
    if (this.state.questionnaire !== undefined) {
      this.jsoneditor.set(this.state.questionnaire);
    }
  }

  componentDidUpdate(prevProps: QuestionnaireEditorProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ questionnaire: this.props.value });
      if (this.props.value !== undefined) {
        this.jsoneditor.set(this.props.value);
      }
    }
  }

  onChangeJSON(json: IQuestionnaire | undefined) {
    this.props.onChange();
    this.setState({ questionnaire: json });
  }

  componentWillUnmount() {}

  render() {
    return (
      <Grid container direction="column">
        <Grid container>
          <Grid item xs={6}>
            <Button onClick={() => this.updateQuestionnaire()} variant="contained" color="secondary">
              Load Questionnaire
            </Button>
          </Grid>
          <Grid container item xs={6} justify="flex-end">
            <Button onClick={() => this.props.resetQuestionnaire()} variant="contained" color="secondary">
              Reset Questionnaire
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div style={this.jsonEditorStyle} ref={(elem) => (this.container = elem)} />
        </Grid>
        <Grid container item xs={12} justify="flex-end">
          <Button onClick={() => this.downloadJson()} variant="contained" color="primary">
            Download Questionnaire
          </Button>
        </Grid>

        {this.state.schemaValidationErrors.length > 0 ? (
          <Grid item xs={12}>
            <Alert severity="error">
              Errors while validating JSON schema.
              {this.state.schemaValidationErrors.map((error, index) => (
                <ListItemText key={index} primary={error.message} />
              ))}
            </Alert>
          </Grid>
        ) : null}

        <Snackbar
          open={this.state.showJsonInvalidMessage}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => this.handleSnackbarClose()}
        >
          <Alert onClose={() => this.handleSnackbarClose()} severity="error">
            Cannot load questionnaire. JSON is invalid!
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
}
