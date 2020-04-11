import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireTextField } from "./components/QuestionnaireTextField";
import { Questionnaire } from "./logic/questionnaire";
import { IQuestionnaire } from "./logic/schema";

let questionnaireLogic: Questionnaire = undefined;

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
  const [isQuestionnaireInSync, setIsQuestionnaireInSync] = useState(true);

  function overwriteCurrentQuestionnaire(newQuestionnaire) {
    setCurrentQuestionnaire(newQuestionnaire);
    restartQuestionnaire(newQuestionnaire);
    setIsQuestionnaireInSync(true);
  }

  function restartQuestionnaire(questionnaire: IQuestionnaire) {
    questionnaireLogic = new Questionnaire(questionnaire);
    setCurrentQuestion(questionnaireLogic.nextQuestion());
    setResult(undefined);
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
            setOriginalCurrentQuestionnaire(value);
            overwriteCurrentQuestionnaire(value);
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
      setResult(questionnaireLogic.getResults());
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
        <Grid container direction="row">
          <Grid item xs={6} data-testid="QuestionnaireExecution">
            {currentQuestionnaire !== undefined ? (
              <QuestionnaireExecution
                result={result}
                currentQuestion={currentQuestion}
                questionnaireLogic={questionnaireLogic}
                isInSync={isQuestionnaireInSync}
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
              onChange={() => setIsQuestionnaireInSync(false)}
              resetQuestionnaire={() =>
                overwriteCurrentQuestionnaire(originalCurrentQuestionnaire)
              }
              loadQuestionnaire={overwriteCurrentQuestionnaire}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
