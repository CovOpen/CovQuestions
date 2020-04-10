import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";

const App = () => {
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState(
    undefined
  );
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
          response.json().then((value) => setCurrentQuestionnaire(value));
        }
      });
    }
  }, [currentQuestionnairePath]);

  return (
    <Container maxWidth="sm">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={6}>
          <QuestionnaireSelectionDropdown
            handleChange={(e) => setCurrentQuestionnairePath(e.target.value)}
            allQuestionnaires={allQuestionnaires}
          />
        </Grid>
        {currentQuestionnaire !== undefined ? (
          <QuestionnaireExecution questionnaire={currentQuestionnaire} />
        ) : null}
      </Grid>
    </Container>
  );
};

export default App;
