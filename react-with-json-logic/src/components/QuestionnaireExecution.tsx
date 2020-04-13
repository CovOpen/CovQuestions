import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Question, Questionnaire, Result } from "../logic/questionnaire";
import { ResultComponent } from "./ResultComponent";
import { QuestionComponent } from "./QuestionComponent";
import { IQuestionnaire } from "../logic/schema";
import { Primitive } from "../Primitive";

type QuestionnaireExecutionProps = {
  isInSync: boolean;
  currentQuestionnaire: { questionnaire: IQuestionnaire; updatedAt: number };
};

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({ isInSync, currentQuestionnaire }) => {
  const [questionnaireEngine, setQuestionnaireEngine] = useState(new Questionnaire(currentQuestionnaire.questionnaire));
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [result, setResult] = useState<Result[] | undefined>(undefined);

  function restartQuestionnaire() {
    const engine = new Questionnaire(currentQuestionnaire.questionnaire);
    const nextQuestion = engine.nextQuestion();

    setResult(undefined);
    setQuestionnaireEngine(engine);
    setCurrentQuestion(nextQuestion);
  }

  function handleNextClick(value: Primitive | Array<Primitive> | undefined) {
    questionnaireEngine.setAnswer(currentQuestion!.id, value);

    const nextQuestion = questionnaireEngine.nextQuestion();
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setCurrentQuestion(undefined);
      setResult(questionnaireEngine.getResults());
    }
  }

  useEffect(restartQuestionnaire, [currentQuestionnaire]);

  return (
    <>
      <Grid item xs={9}>
        <Button onClick={restartQuestionnaire} variant="contained" color="secondary">
          Restart Questionnaire
        </Button>
      </Grid>
      {!isInSync ? (
        <Grid item xs={9}>
          <Alert severity="warning">This questionnaire is out of sync. Please reload.</Alert>
        </Grid>
      ) : null}
      <Grid item xs={9}>
        {result === undefined && currentQuestion ? (
          <QuestionComponent currentQuestion={currentQuestion} handleNextClick={handleNextClick} />
        ) : null}
        {result !== undefined ? <ResultComponent result={result} /> : null}
      </Grid>
      <Grid item xs={9}>
        {questionnaireEngine ? (
          <>
            <Typography>Current internal state:</Typography>
            <Paper>
              <Box style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(questionnaireEngine.getDataObjectForDeveloping(), null, 2)}
              </Box>
            </Paper>
          </>
        ) : null}
      </Grid>
    </>
  );
};
