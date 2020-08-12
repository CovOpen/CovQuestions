/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { startQuestionnaire } from './src/assets/startQuestionnaire';
import { repeatedQuestionnaire } from './src/assets/repeatedQuestionnaire';
import { QuestionnaireExecution } from "./src/components/QuestionnaireExecution";
import { styles } from "./App.styles";

const App = () => {
  const [initialized, setInitialized] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [runQuestionnaire, setRunQuestionnaire] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      try {
        const p = await AsyncStorage.getItem('profile');
        setProfile(JSON.parse(p ?? '{}'));
        setInitialized(true);
      } catch (e) {
        console.log(e);
      }
    };
    doAsync().then();
  }, []);

  const onInitialSetupFinished = async (data: any) => {
    let newProfile = {...data, setup: true};
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
    } catch (e) {
      console.log(e);
    }
    setProfile(newProfile);
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('profile');
      setProfile({});
    } catch (e) {
      console.log(e);
    }
  };

  if (!initialized) {
    return <></>;
  }

  if (!profile.setup) {
    return (
      <>
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.appTitle}>Initiales Setup</Text>
              <QuestionnaireExecution
                currentQuestionnaire={startQuestionnaire}
                onFinishClick={onInitialSetupFinished}
                showRestartButton={false}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!runQuestionnaire) {
    return (
      <>
        <SafeAreaView>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.appTitle}>Tolle App</Text>
              <View style={styles.body}>
                <View style={styles.button}>
                  <Button
                    title={'Tägliche Befragung starten'}
                    onPress={() => setRunQuestionnaire(true)}
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title={'Profil löschen'}
                    onPress={clearProfile}
                    color={'#f3837a'}
                  />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <SafeAreaView>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <QuestionnaireExecution
              currentQuestionnaire={repeatedQuestionnaire}
              onFinishClick={() => setRunQuestionnaire(false)}
              showRestartButton={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
