import React from 'react';
import { Result } from 'covquestions-js/questionnaireEngine';
import { Text, View } from 'react-native';

export const ResultComponent: React.FC<{result: Result[]}> = ({result}) => {
  return (
    <View>
      {result.length > 0 ? (
        result.map((it) => (
          <Text key={it.resultCategory.id}>
            {it.resultCategory.description}: {it.result.text}
          </Text>
        ))
      ) : (
        <Text>No result applies</Text>
      )}
    </View>
  );
};
