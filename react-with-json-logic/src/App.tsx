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
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import "./App.css";
import { QuestionnaireExecution } from "./components/QuestionnaireExecution";
import { QuestionnaireEditor } from "./components/questionnaireEditor/QuestionnaireEditor";
import { Questionnaire } from "./models/Questionnaire";
import { useAppDispatch } from "./store/store";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector, setQuestionnaireInEditor } from "./store/questionnaireInEditor";
import jsonschema from "jsonschema";
import questionnaireSchema from "./schemas/questionnaire.json";
import { QuestionnaireSelectionDrawer } from "./components/QuestionnaireSelection";

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
    },
    noPaddingLeft: {
      paddingLeft: 0,
    },
  })
);

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  const [allQuestionnaires, setAllQuestionnaires] = useState<QuestionnairesList>([]);
  const [currentQuestionnairePath, setCurrentQuestionnairePath] = useState<string>("");
  const [originalCurrentQuestionnaire, setOriginalCurrentQuestionnaire] = useState<Questionnaire | undefined>(
    undefined
  );
  const [executedQuestionnaire, setExecutedQuestionnaire] = useState<Questionnaire | undefined>(undefined);

  const [showJsonInvalidMessage, setShowJsonInvalidMessage] = useState(false);
  const [schemaValidationErrors, setSchemaValidationErrors] = useState<jsonschema.ValidationError[]>([]);

  const [showMenu, setShowMenu] = useState(false);

  const classes = useStyles();

  function overwriteCurrentQuestionnaire(newQuestionnaire: Questionnaire) {
    setExecutedQuestionnaire(JSON.parse(JSON.stringify(newQuestionnaire)));
  }

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
          response.json().then((value) => {
            setOriginalCurrentQuestionnaire(value);
            dispatch(setQuestionnaireInEditor(value));
            overwriteCurrentQuestionnaire(value);
          });
        }
      });
    }
  }, [dispatch, currentQuestionnairePath]);

  useEffect(() => {
    try {
      const validator = new jsonschema.Validator();
      const validationResult = validator.validate(questionnaireJson, questionnaireSchema);
      if (validationResult.errors.length > 0) {
        setSchemaValidationErrors(validationResult.errors);
        setShowJsonInvalidMessage(true);
        return;
      }
      setShowJsonInvalidMessage(false);
      setSchemaValidationErrors([]);
      overwriteCurrentQuestionnaire(questionnaireJson);
    } catch (e) {
      setShowJsonInvalidMessage(true);
    }
  }, [questionnaireJson]);

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
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        className={clsx(classes.content, {
          [classes.noPaddingLeft]: showMenu,
        })}
      >
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
            <Grid item xs={showMenu ? 3 : 4} data-testid="QuestionnaireExecution" onClick={() => setShowMenu(false)}>
              {executedQuestionnaire !== undefined ? (
                <QuestionnaireExecution
                  isJsonInvalid={showJsonInvalidMessage}
                  currentQuestionnaire={executedQuestionnaire}
                />
              ) : null}
            </Grid>
            <Grid item xs={showMenu ? 6 : 8} onClick={() => setShowMenu(false)}>
              <QuestionnaireEditor
                resetQuestionnaire={() => {
                  if (originalCurrentQuestionnaire) {
                    dispatch(setQuestionnaireInEditor(originalCurrentQuestionnaire));
                    overwriteCurrentQuestionnaire(originalCurrentQuestionnaire);
                  }
                }}
                schemaValidationErrors={schemaValidationErrors}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
