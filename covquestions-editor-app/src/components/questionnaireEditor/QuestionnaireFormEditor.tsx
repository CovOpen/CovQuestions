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
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import WarningIcon from "@material-ui/icons/Warning";
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
  formErrorsSelector,
  duplicatedIdsSelector,
} from "../../store/questionnaireInEditor";
import { ElementEditorSwitch } from "./formEditor/elementEditors/ElementEditorSwitch";
import { EditorResultCategory } from "../../models/editorQuestionnaire";

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
  const formErrors = useSelector(formErrorsSelector);
  const duplicatedIds = useSelector(duplicatedIdsSelector);

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
    setActiveItem({ section, index });
  };

  const hasError = (hasError: boolean, id?: string) => {
    if (hasError) {
      return true;
    }
    if (id !== undefined) {
      return duplicatedIds.indexOf(id) > -1;
    }
    return false;
  };

  const hasResultDuplicatedId = (resultCategory: EditorResultCategory) => {
    if (resultCategory.results === undefined) {
      return false;
    }
    let isDuplicate = false;
    for (const result of resultCategory.results) {
      if (duplicatedIds.indexOf(result.id) > -1) {
        isDuplicate = true;
        break;
      }
    }
    return isDuplicate;
  }

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
                {formErrors.meta ? <WarningIcon color={"error"} /> : null}
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
                  {hasError(formErrors.questions[index], item.id) ? <WarningIcon color={"error"} /> : null}
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
                  {hasError(formErrors.resultCategories[index], item.id) || hasResultDuplicatedId(item) ? <WarningIcon color={"error"} /> : null}
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
                  {hasError(formErrors.variables[index], item.id) ? <WarningIcon color={"error"} /> : null}
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
                  {hasError(formErrors.testCases[index]) ? <WarningIcon color={"error"} /> : null}
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
    </>
  );
}
