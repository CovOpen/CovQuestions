import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { Questionnaire } from "./models/Questionnaire";
import { useAppDispatch } from "./store/store";
import { questionnaireInSyncSelector, setQuestionnaireInSync } from "./store/questionnaireInSync";
import { useSelector } from "react-redux";
import { setQuestionnaireInEditor } from "./store/questionnaireInEditor";

type QuestionnairesList = Array<{ name: string; path: string }>;

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const questionnaireInSync = useSelector(questionnaireInSyncSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnairesList>([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<string>("");
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Questionnaire | undefined>(undefined);

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setCurrentQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
    dispatch(setQuestionnaireInSync(true));
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
  }, [currentQuestionnairePath]);

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
            {currentQuestionnaire !== undefined ? (
              <QuestionnaireExecution isInSync={questionnaireInSync} currentQuestionnaire={currentQuestionnaire} />
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
              loadQuestionnaire={overwriteCurrentQuestionnaire}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
