import React, { useEffect, useState } from "react";
import {
  AppBar,
  Container,
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
import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";
import { useAppDispatch } from "./store/store";
import { questionnaireInEditorSelector, setQuestionnaireInEditor } from "./store/questionnaireInEditor";
import {
  QuestionnaireSelection,
  QuestionnaireSelectionDrawer,
} from "./components/questionnaireSelection/QuestionnaireSelection";
import { useSelector } from "react-redux";
import { getAllQuestionnaires, getQuestionnaireByIdVersionAndLanguage } from "./api/api-client";
import { QuestionnaireBaseData } from "./models/QuestionnairesList";
import { VersionSelection } from "./components/questionnaireSelection/VersionSelection";

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
      marginTop: 10,
      paddingLeft: 0,
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
  })
);

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentQuestionnaire = useSelector(questionnaireInEditorSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnaireBaseData[]>([]);
  const [currentQuestionnaireSelection, setCurrentQuestionnaireSelection] = useState<QuestionnaireSelection>({});
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [executedQuestionnaire, setExecutedQuestionnaire] = useState<Questionnaire | undefined>(undefined);

  const [showMenu, setShowMenu] = useState(false);

  const [isJsonMode, setIsJsonMode] = useState(false);

  const classes = useStyles();

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setExecutedQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
  }

  const handleJsonModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsJsonMode(event.target.checked);
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

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setShowMenu(!showMenu)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CovQuestions
          </Typography>
          <div className={classes.settings}>
            {currentQuestionnaireSelection.version !== undefined &&
            currentQuestionnaireSelection.availableVersions !== undefined ? (
              <VersionSelection
                availableVersions={currentQuestionnaireSelection.availableVersions}
                selectedValue={currentQuestionnaireSelection.version}
                handleChange={(value) => {
                  setCurrentQuestionnaireSelection({ ...currentQuestionnaireSelection, ...{ version: value } });
                }}
              ></VersionSelection>
            ) : null}
            <FormControlLabel
              control={<Switch checked={isJsonMode} onChange={handleJsonModeChanged} name="jsonMode" />}
              label="JSON Mode"
            />
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.content}>
        <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
          <Grid container direction="row">
            {showMenu ? (
              <Grid item xs={3}>
                <QuestionnaireSelectionDrawer
                  handleChange={(value) => {
                    setCurrentQuestionnaireSelection(value);
                    setShowMenu(false);
                  }}
                  allQuestionnaires={allQuestionnaires}
                  selectedValue={currentQuestionnaireSelection ?? { id: "", version: 0, language: "de" }}
                />
              </Grid>
            ) : null}
            <Grid item xs={showMenu ? 6 : 8} onClick={() => setShowMenu(false)} className={classes.editor}>
              <QuestionnaireEditor
                resetQuestionnaire={() => {
                  if (originalCurrentQuestionnaire) {
                    dispatch(setQuestionnaireInEditor(originalCurrentQuestionnaire));
                    overwriteCurrentQuestionnaire(originalCurrentQuestionnaire);
                  }
                }}
                isJsonMode={isJsonMode}
              />
            </Grid>
            <Grid item xs={showMenu ? 3 : 4} data-testid="QuestionnaireExecution" onClick={() => setShowMenu(false)}>
              {executedQuestionnaire !== undefined ? (
                <QuestionnaireExecution
                  currentQuestionnaire={currentQuestionnaire.questionnaire}
                  isJsonInvalid={currentQuestionnaire.hasErrors}
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
