import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { Questionnaire } from "./models/Questionnaire";
import { useAppDispatch } from "./store/store";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector, setQuestionnaireInEditor } from "./store/questionnaireInEditor";
import jsonschema from "jsonschema";
import questionnaireSchema from "./schemas/questionnaire.json";

type QuestionnairesList = Array<{ name: string; path: string }>;

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnairesList>([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<string>("");
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [executedQuestionnaire, setExecutedQuestionnaire] = useState<Questionnaire | undefined>(undefined);

  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setExecutedQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
  }

  useEffect(() => {
    fetch("/api/index.json").then((response) => {
      if (response.ok) {
        response.json().then((value) => setAllQuestionnaires(value));
      }
    });
  }, []);

  useEffect(() => {
    if (currentQuestionnairePath !== "") {
      fetch(currentQuestionnairePath).then((response) => {
        if (response.ok) {
          response.json().then((value) => {
            setOriginalCurrentQuestionnaire(value);
            dispatch(setQuestionnaireInEditor(value));
            overwriteCurrentQuestionnaire(value);
          });
        }
      });
    }
  }, [dispatch, currentQuestionnairePath]);

  useEffect(() => {
    try {
      const validator = new jsonschema.Validator();
      const validationResult = validator.validate(questionnaireJson, questionnaireSchema);
      if (validationResult.errors.length > 0) {
        setSchemaValidationErrors(validationResult.errors);
        setShowJsonInvalidMessage(true);
        return;
      }
      setShowJsonInvalidMessage(false);
      setSchemaValidationErrors([]);
      overwriteCurrentQuestionnaire(questionnaireJson);
    } catch (e) {
      setShowJsonInvalidMessage(true);
    }
  }, [questionnaireJson]);

  return (
    <Container>
      <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
        <Grid item xs={12}>
          <QuestionnaireSelectionDropdown
            handleChange={setCurrentQuestionnairePath}
            allQuestionnaires={allQuestionnaires}
          />
        </Grid>
        <Grid container direction="row">
          <Grid item xs={4} data-testid="QuestionnaireExecution">
            {executedQuestionnaire !== undefined ? (
              <QuestionnaireExecution
                isJsonInvalid={showJsonInvalidMessage}
                currentQuestionnaire={executedQuestionnaire}
              />
            ) : null}
          </Grid>
          <Grid item xs={8}>
            <QuestionnaireEditor
              resetQuestionnaire={() => {
                if (originalCurrentQuestionnaire) {
                  dispatch(setQuestionnaireInEditor(originalCurrentQuestionnaire));
                  overwriteCurrentQuestionnaire(originalCurrentQuestionnaire);
                }
              }}
              schemaValidationErrors={schemaValidationErrors}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
