import React, { useEffect, useState } from 'react';
import { ResultComponent } from './ResultComponent';
import { QuestionComponent } from './QuestionComponent';
import { Questionnaire } from 'covquestions-js/models/Questionnaire.generated';
import { Question, QuestionnaireEngine, Result, } from 'covquestions-js/questionnaireEngine';
import { Primitive } from 'covquestions-js/primitive';
import { Button, Text, View } from 'react-native';
import { styles } from "../../App.styles";

type QuestionnaireExecutionProps = {
  currentQuestionnaire: Questionnaire;
  onFinishClick: (data: any) => void;
  showRestartButton: boolean;
};

const showEngineDebugInfo = false;

export const QuestionnaireExecution: React.FC<QuestionnaireExecutionProps> = ({
  currentQuestionnaire,
  onFinishClick,
  showRestartButton,
}) => {
  const [questionnaireEngine, setQuestionnaireEngine] = useState(
    new QuestionnaireEngine(currentQuestionnaire),
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined,
  );
  const [result, setResult] = useState<Result[] | undefined>(undefined);
  const [doRerender, setDoRerender] = useState(false);

  function restartQuestionnaire() {
    const engine = new QuestionnaireEngine(currentQuestionnaire);
    const nextQuestion = engine.nextQuestion();

    setResult(undefined);
    setQuestionnaireEngine(engine);
    setCurrentQuestion(nextQuestion);
    setDoRerender(true);
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

  useEffect(() => {
    if (doRerender) {
      setDoRerender(false);
    }
  }, [doRerender]);

  return (
    <View>
      <View>
        {result === undefined && currentQuestion ? (
          <QuestionComponent
            currentQuestion={currentQuestion}
            handleNextClick={handleNextClick}
          />
        ) : null}
        {result !== undefined ? (
          <>
            <ResultComponent result={result} />
            <View style={styles.button}>
              <Button
                title={'Continue'}
                onPress={() =>
                  onFinishClick(
                    questionnaireEngine.getDataObjectForDeveloping(),
                  )
                }
              />
            </View>
          </>
        ) : null}
      </View>
      <View>
        {questionnaireEngine && showEngineDebugInfo ? (
          <>
            <View>
              <Text>
                {JSON.stringify(
                  {
                    engineData: questionnaireEngine.getDataObjectForDeveloping(),
                  },
                  null,
                  2,
                )}
              </Text>
            </View>
          </>
        ) : null}
      </View>
      {showRestartButton ? (
        <View style={styles.button}>
          <Button
            title={'Restart'}
            onPress={restartQuestionnaire}
            color={'#f3837a'}
          />
        </View>
      ) : null}
    </View>
  );
};
