import React, { useState } from 'react';
import { QuestionFormComponent } from './questionComponents/QuestionFormComponent';
import { Question } from 'covquestions-js/questionnaireEngine';
import { Primitive } from 'covquestions-js/primitive';
import { Button, View } from 'react-native';
import { styles } from '../../App.styles';

type QuestionComponentProps = {
  currentQuestion: Question;
  handleNextClick: (value: Primitive | Array<Primitive> | undefined) => void;
};

export const QuestionComponent: React.FC<QuestionComponentProps> = ({
  currentQuestion,
  handleNextClick,
}) => {
  const [currentValue, setCurrentValue] = useState<
    Primitive | Array<Primitive> | undefined
  >(undefined);

  const next = () => {
    handleNextClick(currentValue);
    setCurrentValue(undefined);
  };

  return (
    <View>
      <QuestionFormComponent
        currentQuestion={currentQuestion}
        onChange={setCurrentValue}
        value={currentValue}
      />
      <View style={styles.button}>
        <Button
          onPress={next}
          title={'Next'}
          disabled={!currentQuestion.isOptional() && currentValue === undefined}
        />
      </View>
    </View>
  );
};
