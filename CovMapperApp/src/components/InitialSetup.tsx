import React from 'react';
import { Text } from 'react-native';
import { styles } from '../../App.styles';
import { QuestionnaireExecution } from './QuestionnaireExecution';
import { startQuestionnaire } from '../assets/startQuestionnaire';

export const InitialSetup: React.FC<{
  onFinishClick: (data: any) => Promise<void>;
}> = (props) => (
  <>
    <Text style={styles.appTitle}>Initiales Setup</Text>
    <QuestionnaireExecution
      currentQuestionnaire={startQuestionnaire}
      onFinishClick={props.onFinishClick}
      showRestartButton={false}
    />
  </>
);
