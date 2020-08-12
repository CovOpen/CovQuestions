import React from 'react';
import { QuestionFormComponentProps } from './QuestionFormComponent';
import { Option } from 'covquestions-js/models/Questionnaire.generated';

import { RadioButton } from 'react-native-paper';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  question: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
  },
});

export const RadioSelect: React.FC<QuestionFormComponentProps> = ({
  currentQuestion,
  onChange,
  value,
}) => {
  const options: Option[] = currentQuestion.options ?? [];

  return (
    <>
      <Text style={styles.question}>{currentQuestion.text}</Text>
      <RadioButton.Group onValueChange={onChange} value={value}>
        {options.map((answer) => (
          <RadioButton.Item
            key={answer.value}
            value={answer.value}
            label={answer.text}
          />
        ))}
      </RadioButton.Group>
    </>
  );
};
