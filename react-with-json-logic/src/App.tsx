import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireTextField } from "./components/QuestionnaireTextField";
import { Questionnaire } from "./logic/questionnaire";
import { IQuestionnaire } from "./logic/schema";

let questionnaireLogic = new Questionnaire();

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

  const [currentQuestion, setCurrentQuestion] = useState(undefined);
  const [result, setResult] = useState(undefined);

  function overwriteCurrentQuestionnaire(newQuestionnaire) {
    setCurrentQuestionnaire(newQuestionnaire);
    restartQuestionnaire(newQuestionnaire);
  }

  function restartQuestionnaire(questionnaire: IQuestionnaire) {
    questionnaireLogic = new Questionnaire();
    questionnaireLogic.setQuestionnaire(questionnaire);
    setCurrentQuestion(questionnaireLogic.nextQuestion());
  }

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
            overwriteCurrentQuestionnaire(value);
            setOriginalCurrentQuestionnaire(value);
            setCurrentQuestion(questionnaireLogic.nextQuestion());
          });
        }
      });
    }
  }, [currentQuestionnairePath]);

  function handleNextClick() {
    const nextQuestion = questionnaireLogic.nextQuestion();
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setResult("Result (not implemented)");
    }
  }

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
              <QuestionnaireExecution
                result={result}
                currentQuestion={currentQuestion}
                questionnaireLogic={questionnaireLogic}
                handleNextClick={handleNextClick}
                restartQuestionnaire={() =>
                  restartQuestionnaire(currentQuestionnaire)
                }
              />
            ) : null}
          </Grid>
          <Grid item xs={6}>
            <QuestionnaireTextField
              value={currentQuestionnaire}
              onChange={overwriteCurrentQuestionnaire}
              resetQuestionnaire={() =>
                overwriteCurrentQuestionnaire(originalCurrentQuestionnaire)
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
