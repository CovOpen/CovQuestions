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
import { SafeAreaView, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { repeatedQuestionnaire } from './src/assets/repeatedQuestionnaire';
import { QuestionnaireExecution } from './src/components/QuestionnaireExecution';
import { styles } from './App.styles';
import { InitialSetup } from './src/components/InitialSetup';
import { HomePage } from './src/components/HomePage';

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

  const renderMainComponent = () => {
    if (!profile.setup) {
      return <InitialSetup onFinishClick={onInitialSetupFinished} />;
    }

    if (runQuestionnaire) {
      return (
        <QuestionnaireExecution
          currentQuestionnaire={repeatedQuestionnaire}
          onFinishClick={() => setRunQuestionnaire(false)}
          showRestartButton={false}
        />
      );
    }

    return (
      <HomePage
        startDailyQuestionnaire={() => setRunQuestionnaire(true)}
        deleteProfile={clearProfile}
      />
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.sectionContainer}>{renderMainComponent()}</View>
      </View>
    </SafeAreaView>
  );
};

export default App;
