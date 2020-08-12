# Prototype for a CovMapper/CovQuestions App

## Developer instructions

1. Follow the setup instructions for React Native according to the 
`React Native CLI Quickstart` guide for your operating system 
https://reactnative.dev/docs/environment-setup 
(tested with Linux/Android under Ubuntu 20.04) 

2. Run `npm run installCovQuestions` in this folder (`CovMapperApp`) to install the 
not yet published local dependency `covquestions-js`.

3. Run `npm run start` and `npm run android` in two separate terminals while a phone 
(virtual or real Android device) is attached to your computer to start the interactive 
development experience.

4. Create an apk package to distribute the app to non-developers with `./gradlew assembleRelease`
inside `CovMapperApp/android`. 
The apk is then located at `CovMapperApp/android/app/build/outputs/apk/release/app-release.apk`.
