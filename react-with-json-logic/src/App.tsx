import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  createMuiTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { Questionnaire } from "./models/Questionnaire";
import { useAppDispatch } from "./store/store";
import { setQuestionnaireInEditor, questionnaireInEditorSelector } from "./store/questionnaireInEditor";
import { QuestionnaireSelectionDrawer } from "./components/QuestionnaireSelection";
import { useSelector } from "react-redux";

type QuestionnairesList = Array<{ name: string; path: string }>;

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
    jsonMode: {
      position: "absolute",
      right: 0,
    },
  })
);

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentQuestionnaire = useSelector(questionnaireInEditorSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnairesList>([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<string>("");
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
    fetch("/api/index.json").then((response) => {
      if (response.ok) {
        response.json().then((value) => setAllQuestionnaires(value));
      }
    });
  }, []);

  useEffect(() => {
    if (currentQuestionnairePath !== "") {
      fetch(currentQuestionnairePath).then((response) => {
        if (response.ok) {
          response.json().then((value: Questionnaire) => {
            setOriginalCurrentQuestionnaire(value);
            dispatch(setQuestionnaireInEditor(value));
            overwriteCurrentQuestionnaire(value);
          });
        }
      });
    }
  }, [dispatch, currentQuestionnairePath]);

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
          <FormControlLabel
            className={classes.jsonMode}
            control={<Switch checked={isJsonMode} onChange={handleJsonModeChanged} name="jsonMode" />}
            label="JSON Mode"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.content}>
        <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
          <Grid container direction="row">
            {showMenu ? (
              <Grid item xs={3}>
                <QuestionnaireSelectionDrawer
                  handleChange={(value) => {
                    setCurrentQuestionnairePath(value);
                    setShowMenu(false);
                  }}
                  allQuestionnaires={allQuestionnaires}
                  selectedValue={currentQuestionnairePath}
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
