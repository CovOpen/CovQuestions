import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  createMuiTheme,
  createStyles,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Switch,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { ISOLanguage, Questionnaire } from "@covopen/covquestions-js";
import { useAppDispatch } from "./store/store";
import {
  questionnaireInEditorSelector,
  questionnaireJsonSelector,
  setQuestionnaireInEditor,
  duplicatedIdsSelector,
  hasAnyErrorSelector,
} from "./store/questionnaireInEditor";
import { QuestionnaireSelectionDrawer } from "./components/questionnaireSelection/QuestionnaireSelection";
import { useSelector } from "react-redux";
import { getAllQuestionnaires, getQuestionnaireByIdVersionAndLanguage } from "./api/api-client";
import { QuestionnaireBaseData } from "./models/QuestionnairesList";
import { SettingSelection } from "./components/questionnaireSelection/SettingSelection";
import { getQueryParams, QuestionnaireIdentification, setQueryParams } from "./utils/queryParams";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#667EEA",
    },
    secondary: {
      main: "#E2E8F0",
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      background: "#EDF2F7",
    },
    editor: {
      background: "#F7FAFC",
      boxShadow: "3px 0px 34px rgba(0, 0, 0, 0.06)",
    },
    settings: {
      display: "inline-flex",
      position: "absolute",
      right: 0,
    },
    marginRight: {
      marginRight: "10px",
    },
  })
);

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { questionnaire: currentQuestionnaire } = useSelector(questionnaireInEditorSelector);
  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const duplicatedIds = useSelector(duplicatedIdsSelector);
  const hasAnyError = useSelector(hasAnyErrorSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnaireBaseData[]>([]);
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [executedQuestionnaire, setExecutedQuestionnaire] = useState<Questionnaire | undefined>(undefined);
  const [currentTitle, setCurrentTitle] = useState<string | undefined>(undefined);

  const [showMenu, setShowMenu] = useState(false);

  const [isJsonMode, setIsJsonMode] = useState(false);
  const [requestInFlight, setRequestInFlight] = useState(false);

  const classes = useStyles();

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setExecutedQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
  }

  const handleJsonModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsJsonMode(event.target.checked);
  };

  const handleVersionChanged = (newVersion: number) => {
    const questionnaire = allQuestionnaires.filter(
      (it) => it.id === currentQuestionnaire.id && it.version === newVersion
    )[0];
    const changedValues = {
      version: newVersion,
      availableLanguages: questionnaire.meta.availableLanguages,
      language: currentQuestionnaire.language,
    };
    if (
      currentQuestionnaire.language !== undefined &&
      changedValues.availableLanguages.indexOf(currentQuestionnaire.language) === -1
    ) {
      if (changedValues.availableLanguages.indexOf("en") > -1) {
        changedValues.language = "en";
      } else {
        changedValues.language = changedValues.availableLanguages[0];
      }
    }
    fetchQuestionnaire({ ...currentQuestionnaire, ...changedValues });
  };

  const downloadJson = () => {
    if (questionnaireJson === undefined) {
      return;
    }
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(questionnaireJson, null, 2)], { type: "text/plain" });
    linkElement.href = URL.createObjectURL(jsonFile);
    linkElement.download = questionnaireJson.id + ".json";
    document.body.appendChild(linkElement);
    linkElement.click();
  };

  const resetQuestionnaire = () => {
    if (originalCurrentQuestionnaire) {
      dispatch(setQuestionnaireInEditor(originalCurrentQuestionnaire));
      overwriteCurrentQuestionnaire(originalCurrentQuestionnaire);
    }
  };

  function fetchQuestionnaire(
    { id, version, language }: QuestionnaireIdentification,
    overwriteCurrent: boolean = true
  ) {
    if (!requestInFlight) {
      setRequestInFlight(true);
      getQuestionnaireByIdVersionAndLanguage(id, version, language)
        .then((value) => {
          if (value !== undefined) {
            setOriginalCurrentQuestionnaire(value);
            if (overwriteCurrent) {
              dispatch(setQuestionnaireInEditor(value));
              overwriteCurrentQuestionnaire(value);
            }
          } else {
            console.error(`Cannot get questionnaire with values ${JSON.stringify(currentQuestionnaire)}`);
          }
        })
        .finally(() => {
          setRequestInFlight(false);
        });
    }
  }

  useEffect(() => {
    getAllQuestionnaires().then((value) => setAllQuestionnaires(value));
  }, []);

  useEffect(() => {
    setQueryParams(currentQuestionnaire);
  }, [dispatch, currentQuestionnaire]);

  useEffect(() => {
    if (currentQuestionnaire === undefined || currentQuestionnaire === undefined || currentQuestionnaire.title === "") {
      setCurrentTitle(undefined);
    } else {
      setCurrentTitle(currentQuestionnaire.title);
    }

    if (!hasAnyError) {
      setExecutedQuestionnaire(currentQuestionnaire);
    }
  }, [currentQuestionnaire, hasAnyError]);

  if (currentQuestionnaire.id != null && originalCurrentQuestionnaire === undefined) {
    // Fetch original Questionnaire, as we only have the one stored in State
    fetchQuestionnaire(currentQuestionnaire, false);
  }
  const querySelection = getQueryParams();
  // Disable for now
  //   if (querySelection.id != null && currentQuestionnaire.id == null) {
  //     fetchQuestionnaire(querySelection);
  //   }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setShowMenu(!showMenu)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CovQuestions {currentTitle !== undefined ? <> - {currentTitle}</> : null}
          </Typography>
          <div className={classes.settings}>
            <Button onClick={resetQuestionnaire} className={classes.marginRight} variant="outlined" color="secondary">
              Reset
            </Button>
            <Button onClick={downloadJson} className={classes.marginRight} variant="contained" color="secondary">
              Download
            </Button>
            {currentQuestionnaire.language !== undefined &&
            currentQuestionnaire.meta.availableLanguages !== undefined ? (
              <SettingSelection
                title="Language"
                values={currentQuestionnaire.meta.availableLanguages}
                selectedValue={currentQuestionnaire.language}
                handleChange={(value) => {
                  fetchQuestionnaire({ ...currentQuestionnaire, language: value as ISOLanguage });
                }}
              ></SettingSelection>
            ) : null}
            {currentQuestionnaire.version !== undefined ? (
              <SettingSelection
                title="Version"
                values={getVersions(currentQuestionnaire.id, allQuestionnaires)}
                selectedValue={currentQuestionnaire.version}
                handleChange={(value) => {
                  handleVersionChanged(value as number);
                }}
              ></SettingSelection>
            ) : null}
            <FormControlLabel
              control={<Switch checked={isJsonMode} onChange={handleJsonModeChanged} name="jsonMode" />}
              label="JSON Mode"
            />
          </div>
        </Toolbar>
      </AppBar>

      <Grid
        container
        className={`${classes.content} flex-grow overflow-pass-through`}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item container direction="row" className={`flex-grow overflow-pass-through`}>
          {showMenu ? (
            <Grid item xs={3}>
              <QuestionnaireSelectionDrawer
                handleChange={(value) => {
                  fetchQuestionnaire(value);
                  setShowMenu(false);
                }}
                allQuestionnaires={allQuestionnaires}
                selectedValue={currentQuestionnaire}
              />
            </Grid>
          ) : null}
          <Grid
            item
            container
            xs={showMenu ? 6 : 8}
            onClick={() => setShowMenu(false)}
            className={`${classes.editor} flex-grow overflow-pass-through`}
          >
            <QuestionnaireEditor isJsonMode={isJsonMode} />
          </Grid>
          <Grid
            item
            container
            xs={showMenu ? 3 : 4}
            data-testid="QuestionnaireExecution"
            onClick={() => setShowMenu(false)}
            className={`flex-grow overflow-pass-through`}
          >
            {executedQuestionnaire !== undefined ? (
              <QuestionnaireExecution
                currentQuestionnaire={executedQuestionnaire}
                isJsonInvalid={hasAnyError || duplicatedIds.length > 0}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export function getVersions(id: string, questionnaires: QuestionnaireBaseData[]): number[] {
  const versions = questionnaires.filter((it) => it.id === id).map((it) => it.version);
  return versions.sort();
}
