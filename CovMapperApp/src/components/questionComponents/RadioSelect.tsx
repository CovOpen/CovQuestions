import React from 'react';
import { QuestionFormComponentProps } from './QuestionFormComponent';
import { Option } from 'covquestions-js/models/Questionnaire.generated';

import { RadioButton } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  question: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
  },
  answerOptions: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.97)',
  },
});

export const RadioSelect: React.FC<QuestionFormComponentProps> = ({
  currentQuestion,
  onChange,
  value,
}) => {
  const handleChange = (value: any) => {
    if (currentQuestion.type === 'boolean') {
      onChange(value === 'true');
    } else {
      onChange(value);
    }
  };

  const options: Option[] = currentQuestion.options ?? [
    {value: 'true', text: 'yes'},
    {value: 'false', text: 'no'},
  ];

  return (
    <RadioButton.Group onValueChange={handleChange} value={value}>
      <View>
        <Text style={styles.question}>{currentQuestion.text}</Text>
      </View>
      {options.map((answer) => (
        <View key={answer.value} style={{flexDirection: 'row'}}>
          <RadioButton value={answer.value} />
          <Text style={styles.answerOptions}>{answer.text}</Text>
        </View>
      ))}
    </RadioButton.Group>
  );
};
