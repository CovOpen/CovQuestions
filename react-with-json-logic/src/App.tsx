import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { IQuestionnaire } from "./logic/schema";

type QuestionnairesList = Array<{ name: string; path: string }>;

export const App: React.FC = () => {
  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnairesList>([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<string>("");
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<IQuestionnaire | undefined>(
    undefined
  );
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<
    { questionnaire: IQuestionnaire; updatedAt: number } | undefined
  >(undefined);

  const [isQuestionnaireInSync, setIsQuestionnaireInSync] = useState(true);

  function overwriteCurrentQuestionnaire(newQuestionnaire: IQuestionnaire) {
    setCurrentQuestionnaire({ questionnaire: newQuestionnaire, updatedAt: Date.now() });
    setIsQuestionnaireInSync(true);
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
              <QuestionnaireExecution isInSync={isQuestionnaireInSync} currentQuestionnaire={currentQuestionnaire} />
            ) : null}
          </Grid>
          <Grid item xs={8}>
            <QuestionnaireEditor
              value={currentQuestionnaire?.questionnaire}
              onChange={() => setIsQuestionnaireInSync(false)}
              resetQuestionnaire={() => {
                if (originalCurrentQuestionnaire) {
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
