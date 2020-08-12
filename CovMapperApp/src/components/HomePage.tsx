import React from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from '../../App.styles';

export const HomePage: React.FC<{
  startDailyQuestionnaire: () => void;
  deleteProfile: () => Promise<void>;
}> = (props) => (
  <>
    <Text style={styles.appTitle}>Tolle App</Text>
    <View style={styles.body}>
      <View style={styles.button}>
        <Button
          title={'Tägliche Befragung starten'}
          onPress={props.startDailyQuestionnaire}
        />
      </View>
      <View style={styles.button}>
        <Button
          title={'Profil löschen'}
          onPress={props.deleteProfile}
          color={'#f3837a'}
        />
      </View>
    </View>
  </>
);
