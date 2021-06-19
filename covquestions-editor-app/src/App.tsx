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
  duplicatedIdsSelector,
  hasAnyErrorSelector,
  questionnaireInEditorSelector,
  questionnaireJsonSelector,
  setQuestionnaireInEditor,
} from "./store/questionnaireInEditor";
import {
  QuestionnaireSelection,
  QuestionnaireSelectionDrawer,
} from "./components/questionnaireSelection/QuestionnaireSelection";
import { useSelector } from "react-redux";
import { getAllQuestionnaires, getQuestionnaireByIdVersionAndLanguage } from "./api/api-client";
import { QuestionnaireBaseData } from "./models/QuestionnairesList";
import { SettingSelection } from "./components/questionnaireSelection/SettingSelection";
import { getQueryParams, setQueryParams } from "./utils/queryParams";
import { UserInstructions } from "./components/UserInstructions";

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

const useStyles = makeStyles(() =>
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

  const currentQuestionnaire = useSelector(questionnaireInEditorSelector);
  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const duplicatedIds = useSelector(duplicatedIdsSelector);
  const hasAnyError = useSelector(hasAnyErrorSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnaireBaseData[]>([]);
  const [currentQuestionnaireSelection, setCurrentQuestionnaireSelection] = useState<QuestionnaireSelection>({});
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [executedQuestionnaire, setExecutedQuestionnaire] = useState<Questionnaire | undefined>(undefined);
  const [currentTitle, setCurrentTitle] = useState<string | undefined>(undefined);

  const [showMenu, setShowMenu] = useState(false);

  const [isJsonMode, setIsJsonMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const classes = useStyles();

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setExecutedQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
  }

  const handleJsonModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsJsonMode(event.target.checked);
  };

  const handleVersionChanged = (newVersion: number) => {
    const questionnaire = allQuestionnaires.filter(
      (it) => it.id === currentQuestionnaireSelection.id && it.version === newVersion
    )[0];
    const changedValues = {
      version: newVersion,
      availableLanguages: questionnaire.meta.availableLanguages,
      language: currentQuestionnaireSelection.language,
    };
    if (
      currentQuestionnaireSelection.language !== undefined &&
      changedValues.availableLanguages.indexOf(currentQuestionnaireSelection.language) === -1
    ) {
      if (changedValues.availableLanguages.indexOf("en") > -1) {
        changedValues.language = "en";
      } else {
        changedValues.language = changedValues.availableLanguages[0];
      }
    }
    setCurrentQuestionnaireSelection({
      ...currentQuestionnaireSelection,
      ...changedValues,
    });
  };

  const downloadJson = () => {
    if (questionnaireJson === undefined) {
      return;
    }
    // after https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react/44661948
    const linkElement = document.createElement("a");
    const jsonFile = new Blob([JSON.stringify(questionnaireJson, null, 2)], {
      type: "text/plain",
    });
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

  useEffect(() => {
    getAllQuestionnaires().then((value) => setAllQuestionnaires(value));
  }, []);

  useEffect(() => {
    if (
      currentQuestionnaireSelection.id !== undefined &&
      currentQuestionnaireSelection.version !== undefined &&
      currentQuestionnaireSelection.language !== undefined
    ) {
      setQueryParams(currentQuestionnaireSelection);

      getQuestionnaireByIdVersionAndLanguage(
        currentQuestionnaireSelection.id,
        currentQuestionnaireSelection.version,
        currentQuestionnaireSelection.language
      ).then((value) => {
        if (value !== undefined) {
          setOriginalCurrentQuestionnaire(value);
          dispatch(setQuestionnaireInEditor(value));
          overwriteCurrentQuestionnaire(value);
        } else {
          console.error(`Cannot get questionnaire with values ${JSON.stringify(currentQuestionnaireSelection)}`);
        }
      });
    }
  }, [dispatch, currentQuestionnaireSelection]);

  useEffect(() => {
    if (
      currentQuestionnaire === undefined ||
      currentQuestionnaire.questionnaire === undefined ||
      currentQuestionnaire.questionnaire.title === ""
    ) {
      setCurrentTitle(undefined);
    } else {
      setCurrentTitle(currentQuestionnaire.questionnaire.title);
    }

    if (!hasAnyError) {
      setExecutedQuestionnaire(currentQuestionnaire.questionnaire);
    }
  }, [currentQuestionnaire, hasAnyError]);

  // Select Questionnaire that is saved in the query params
  const querySelection: QuestionnaireSelection = getQueryParams();
  if (querySelection.id != null && currentQuestionnaireSelection.id == null) {
    setCurrentQuestionnaireSelection(querySelection);
  }

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
            {currentQuestionnaireSelection.language !== undefined &&
            currentQuestionnaireSelection.availableLanguages !== undefined ? (
              <SettingSelection
                title="Language"
                values={currentQuestionnaireSelection.availableLanguages}
                selectedValue={currentQuestionnaireSelection.language}
                handleChange={(value) => {
                  setCurrentQuestionnaireSelection({
                    ...currentQuestionnaireSelection,
                    ...{ language: value as ISOLanguage },
                  });
                }}
              />
            ) : null}
            {currentQuestionnaireSelection.version !== undefined &&
            currentQuestionnaireSelection.availableVersions !== undefined ? (
              <SettingSelection
                title="Version"
                values={currentQuestionnaireSelection.availableVersions}
                selectedValue={currentQuestionnaireSelection.version}
                handleChange={(value) => {
                  handleVersionChanged(value as number);
                }}
              />
            ) : null}
            <FormControlLabel
              control={<Switch checked={isJsonMode} onChange={handleJsonModeChanged} name="jsonMode" />}
              label="JSON Mode"
            />
            <Button
              onClick={() => setIsHelpOpen(true)}
              className={classes.marginRight}
              variant="outlined"
              color="secondary"
            >
              ?
            </Button>
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
                  setCurrentQuestionnaireSelection(value);
                  setShowMenu(false);
                }}
                allQuestionnaires={allQuestionnaires}
                selectedValue={
                  currentQuestionnaireSelection ?? {
                    id: "",
                    version: 0,
                    language: "de",
                  }
                }
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
      <UserInstructions open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </ThemeProvider>
  );
};
