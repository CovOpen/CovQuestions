import {
  Button,
  createStyles,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import {
  addNewQuestion,
  addNewResultCategory,
  addNewTestCase,
  addNewVariable,
  questionnaireInEditorSelector,
  removeItem,
  swapItemWithNextOne,
} from "../../store/questionnaireInEditor";
import { ElementEditorSwitch } from "./ElementEditorSwitch";
import { Alert } from "@material-ui/lab";

type QuestionnaireFormEditorProps = {
  heightWithoutEditor: number;
};

export enum SectionType {
  META = "meta",
  QUESTIONS = "questions",
  RESULT_CATEGORIES = "resultCategories",
  VARIABLES = "variables",
  TEST_CASES = "testCases",
  RUN_TEST_CASES = "runTestCases",
}

function isNonArraySection(section: SectionType): section is SectionType.META | SectionType.RUN_TEST_CASES {
  return section === SectionType.META || section === SectionType.RUN_TEST_CASES;
}

export type ActiveItem = {
  section: SectionType;
  index: number;
};

export function QuestionnaireFormEditor(props: QuestionnaireFormEditorProps) {
  const dispatch = useAppDispatch();
  const questionnaireInEditor = useSelector(questionnaireInEditorSelector);

  const useStyles = makeStyles(() =>
    createStyles({
      selectionList: {
        width: "100%",
      },
      selectionListDivider: {
        width: "100%",
      },
      selection: {
        height: `calc(100vh - ${props.heightWithoutEditor}px)`,
        overflowY: "auto",
        overflowX: "hidden",
      },
      listItem: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: "2px",
        paddingBottom: "2px",
      },
      formContainer: {
        paddingLeft: "10px",
        height: `calc(100vh - ${props.heightWithoutEditor}px)`,
      },
      alignRight: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
      },
      sectionHeader: {
        alignItems: "center",
        display: "inline-flex",
        width: "100%",
      },
      title: {
        fontWeight: "bold",
        textTransform: "uppercase",
      },
      listItemText: {
        fontSize: "0.9rem",
        lineHeight: "1.25rem",
        paddingLeft: 10,
      },
      addButton: {
        marginLeft: "auto",
      },
    })
  );

  const classes = useStyles();

  const [activeItem, setActiveItem] = useState<ActiveItem>({ section: SectionType.META, index: 0 });
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const style = `
    .rjsf > .MuiFormControl-root {
      height: calc(100vh - ${
        isNonArraySection(activeItem.section) ? props.heightWithoutEditor : props.heightWithoutEditor + 48
      }px);
      overflow-x: hidden !important;
      overflow-x: auto;
    }
    .rjsf .MuiGrid-item {
      padding: 0px 8px 0px 8px;
    }
    .rjsf .MuiButton-textSecondary {
      color: rgba(0, 0, 0, 0.87);
    }
    .rjsf .MuiPaper-root {
      background: #F7FAFC;
    }
    `;

  useEffect(() => {
    if (isNonArraySection(activeItem.section)) {
      return;
    }

    const lengthOfActiveSection = questionnaireInEditor.questionnaire[activeItem.section]?.length;
    if (lengthOfActiveSection === undefined || lengthOfActiveSection === 0) {
      setActiveItem({ section: SectionType.META, index: 0 });
      return;
    }
    if (activeItem.index >= lengthOfActiveSection) {
      setActiveItem({ section: activeItem.section, index: lengthOfActiveSection - 1 });
    }
  }, [activeItem, questionnaireInEditor]);

  const handleMoveUp = () => {
    if (!isNonArraySection(activeItem.section)) {
      dispatch(swapItemWithNextOne({ section: activeItem.section, index: activeItem.index - 1 }));
      setActiveItem({ section: activeItem.section, index: activeItem.index - 1 });
    }
  };

  const handleMoveDown = () => {
    if (!isNonArraySection(activeItem.section)) {
      dispatch(swapItemWithNextOne({ section: activeItem.section, index: activeItem.index }));
      setActiveItem({ section: activeItem.section, index: activeItem.index + 1 });
    }
  };

  const handleRemove = () => {
    if (!isNonArraySection(activeItem.section)) {
      dispatch(removeItem({ section: activeItem.section, index: activeItem.index }));
    }
  };

  const handleActiveItemChange = (section: SectionType, index: number) => {
    if (questionnaireInEditor.hasErrors) {
      setShowSnackbar(true);
      return;
    }
    setActiveItem({ section, index });
  };

  return (
    <>
      <Grid container direction="column">
        <style>{style}</style>
        <Grid container>
          <Grid container item xs={3} className={classes.selection}>
            <Typography className={classes.title}>General</Typography>
            <List className={classes.selectionList}>
              <ListItem
                className={classes.listItem}
                button
                selected={activeItem.section === SectionType.META}
                onClick={() => handleActiveItemChange(SectionType.META, 0)}
              >
                <ListItemText classes={{ primary: classes.listItemText }} primary="Meta" />
              </ListItem>
            </List>
            <Divider className={classes.selectionListDivider} />
            <List className={classes.selectionList}>
              <div className={classes.sectionHeader}>
                <Typography className={classes.title}>Questions</Typography>
                <IconButton
                  className={classes.addButton}
                  aria-label="add-question"
                  onClick={() => {
                    if (questionnaireInEditor.hasErrors) {
                      setShowSnackbar(true);
                      return;
                    }
                    dispatch(addNewQuestion());
                    handleActiveItemChange(SectionType.QUESTIONS, questionnaireInEditor.questionnaire.questions.length);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </div>
              {questionnaireInEditor.questionnaire.questions.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.QUESTIONS && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.QUESTIONS, index)}
                  key={index}
                >
                  <ListItemText classes={{ primary: classes.listItemText }} primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Divider className={classes.selectionListDivider} />
            <div className={classes.sectionHeader}>
              <Typography className={classes.title}>Result Categories</Typography>
              <IconButton
                className={classes.addButton}
                aria-label="add-result-category"
                onClick={() => {
                  if (questionnaireInEditor.hasErrors) {
                    setShowSnackbar(true);
                    return;
                  }
                  dispatch(addNewResultCategory());
                  handleActiveItemChange(
                    SectionType.RESULT_CATEGORIES,
                    questionnaireInEditor.questionnaire.resultCategories.length
                  );
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
            <List className={classes.selectionList}>
              {questionnaireInEditor.questionnaire.resultCategories.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.RESULT_CATEGORIES && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.RESULT_CATEGORIES, index)}
                  key={index}
                >
                  <ListItemText classes={{ primary: classes.listItemText }} primary={item.id} />
                </ListItem>
              ))}
            </List>
            <Divider className={classes.selectionListDivider} />
            <div className={classes.sectionHeader}>
              <Typography className={classes.title}>Variables</Typography>
              <IconButton
                className={classes.addButton}
                aria-label="add-variable"
                onClick={() => {
                  if (questionnaireInEditor.hasErrors) {
                    setShowSnackbar(true);
                    return;
                  }
                  dispatch(addNewVariable());
                  handleActiveItemChange(SectionType.VARIABLES, questionnaireInEditor.questionnaire.variables.length);
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
            <List className={classes.selectionList}>
              {questionnaireInEditor.questionnaire.variables.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.VARIABLES && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.VARIABLES, index)}
                  key={index}
                >
                  <ListItemText classes={{ primary: classes.listItemText }} primary={item.id} />
                </ListItem>
              ))}
            </List>
            <Divider className={classes.selectionListDivider} />
            <div className={classes.sectionHeader}>
              <Typography className={classes.title}>Test Cases</Typography>
              <IconButton
                className={classes.addButton}
                aria-label="add-test-case"
                onClick={() => {
                  if (questionnaireInEditor.hasErrors) {
                    setShowSnackbar(true);
                    return;
                  }
                  dispatch(addNewTestCase());
                  handleActiveItemChange(
                    SectionType.TEST_CASES,
                    (questionnaireInEditor.questionnaire.testCases ?? []).length
                  );
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
            <List className={classes.selectionList}>
              {(questionnaireInEditor.questionnaire.testCases ?? []).map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.TEST_CASES && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.TEST_CASES, index)}
                  key={index}
                >
                  <ListItemText classes={{ primary: classes.listItemText }} primary={item.description} />
                </ListItem>
              ))}
              <ListItem className={classes.listItem}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleActiveItemChange(SectionType.RUN_TEST_CASES, 0)}
                >
                  Run all test cases
                </Button>
              </ListItem>
            </List>
            <Divider className={classes.selectionListDivider} />
          </Grid>
          <Grid container item xs={9} className={classes.formContainer}>
            {!isNonArraySection(activeItem.section) ? (
              <div className={classes.alignRight}>
                <IconButton aria-label="move-up" disabled={activeItem.index <= 0} onClick={handleMoveUp}>
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  aria-label="move-down"
                  disabled={
                    activeItem.index >= (questionnaireInEditor.questionnaire[activeItem.section]?.length ?? 0) - 1
                  }
                  onClick={handleMoveDown}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton aria-label="remove" onClick={handleRemove}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ) : null}
            <ElementEditorSwitch activeItem={activeItem} />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Errors in form. Cannot navigate to other element.
        </Alert>
      </Snackbar>
    </>
  );
}
