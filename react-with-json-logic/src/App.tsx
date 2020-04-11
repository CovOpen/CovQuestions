import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import "./App.css";
import { QuestionnaireSelectionDropdown } from "./components/QuestionnaireSelectionDropdown";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireTextField } from "./components/QuestionnaireTextField";
import { Question, Questionnaire, Result } from "./logic/questionnaire";
import { IQuestionnaire } from "./logic/schema";

type QuestionnairesList = Array<{ name: string; path: string }>;

let questionnaireLogic: Questionnaire | undefined = undefined;

export const App: React.FC = () => {
  const [allQuestionnaires, setAllQuestionnaires] = useState<
    QuestionnairesList
  >([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<
    string | undefined
  >(undefined);
  const [
    originalCurrentQuestionnaire,
    setOriginalCurrentQuestionnaire,
  ] = useState(undefined);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<
    IQuestionnaire | undefined
  >(undefined);

  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined
  );
  const [result, setResult] = useState<Result[] | undefined>(undefined);
  const [isQuestionnaireInSync, setIsQuestionnaireInSync] = useState(true);

  function overwriteCurrentQuestionnaire(newQuestionnaire: IQuestionnaire) {
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
    // eslint-disable-next-line
  }, [currentQuestionnairePath]);

  function handleNextClick() {
    if (questionnaireLogic === undefined) {
      return;
    }
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
            handleChange={setCurrentQuestionnairePath}
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
              value={JSON.stringify(currentQuestionnaire, null, 2)}
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
