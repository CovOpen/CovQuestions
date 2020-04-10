import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireTextField } from "./components/QuestionnaireTextField";

const App = () => {
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState(
    undefined
  );
  const [
    originalCurrentQuestionnaire,
    setOriginalCurrentQuestionnaire,
  ] = useState(undefined);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState(undefined);

  useEffect(() => {
    fetch("/api/index.json").then((response) => {
      if (response.ok) {
        response.json().then((value) => setAllQuestionnaires(value));
      }
    });
  }, []);

  useEffect(() => {
    if (currentQuestionnairePath !== undefined) {
      fetch(currentQuestionnairePath).then((response) => {
        if (response.ok) {
          response.json().then((value) => {
            setCurrentQuestionnaire(value);
            setOriginalCurrentQuestionnaire(value);
          });
        }
      });
    }
  }, [currentQuestionnairePath]);

  return (
    <Container>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <QuestionnaireSelectionDropdown
            handleChange={(e) => setCurrentQuestionnairePath(e.target.value)}
            allQuestionnaires={allQuestionnaires}
          />
        </Grid>
        <Grid container direction="row" xs={12}>
          <Grid item xs={6}>
            {currentQuestionnaire !== undefined ? (
              <QuestionnaireExecution questionnaire={currentQuestionnaire} />
            ) : null}
          </Grid>
          <Grid item xs={6}>
            <QuestionnaireTextField
              value={currentQuestionnaire}
              onChange={setCurrentQuestionnaire}
              resetQuestionnaire={() =>
                setCurrentQuestionnaire(originalCurrentQuestionnaire)
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
