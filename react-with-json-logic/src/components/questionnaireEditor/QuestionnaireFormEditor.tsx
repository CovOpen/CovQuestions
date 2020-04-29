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
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import {
  addNewQuestion,
  addNewResultCategory,
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
        activeItem.section === SectionType.META ? props.heightWithoutEditor : props.heightWithoutEditor + 48
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
    if (activeItem.section === SectionType.META) {
      return;
    }

    const lengthOfActiveSection = questionnaireInEditor.questionnaire[activeItem.section].length;
    if (lengthOfActiveSection === 0) {
      setActiveItem({ section: SectionType.META, index: 0 });
    }
    if (activeItem.index >= lengthOfActiveSection) {
      setActiveItem({ section: activeItem.section, index: lengthOfActiveSection - 1 });
    }
  }, [activeItem, questionnaireInEditor]);

  const handleMoveUp = () => {
    if (activeItem.section !== SectionType.META) {
      dispatch(swapItemWithNextOne({ section: activeItem.section, index: activeItem.index - 1 }));
      setActiveItem({ section: activeItem.section, index: activeItem.index - 1 });
    }
  };

  const handleMoveDown = () => {
    if (activeItem.section !== SectionType.META) {
      dispatch(swapItemWithNextOne({ section: activeItem.section, index: activeItem.index }));
      setActiveItem({ section: activeItem.section, index: activeItem.index + 1 });
    }
  };

  const handleRemove = () => {
    if (activeItem.section !== SectionType.META) {
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
            <List className={classes.selectionList}>
              <ListItem
                className={classes.listItem}
                button
                selected={activeItem.section === SectionType.META}
                onClick={() => handleActiveItemChange(SectionType.META, 0)}
              >
                <ListItemText primary="Meta" />
              </ListItem>
            </List>
            <Divider className={classes.selectionListDivider} />
            <List className={classes.selectionList}>
              {questionnaireInEditor.questionnaire.questions.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.QUESTIONS && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.QUESTIONS, index)}
                  key={index}
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              <ListItem className={classes.listItem}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (questionnaireInEditor.hasErrors) {
                      setShowSnackbar(true);
                      return;
                    }
                    dispatch(addNewQuestion());
                    handleActiveItemChange(SectionType.QUESTIONS, questionnaireInEditor.questionnaire.questions.length);
                  }}
                >
                  Add Question
                </Button>
              </ListItem>
            </List>
            <Divider className={classes.selectionListDivider} />
            <List className={classes.selectionList}>
              {questionnaireInEditor.questionnaire.resultCategories.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.RESULT_CATEGORIES && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.RESULT_CATEGORIES, index)}
                  key={index}
                >
                  <ListItemText primary={item.id} />
                </ListItem>
              ))}
              <ListItem className={classes.listItem}>
                <Button
                  variant="contained"
                  color="secondary"
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
                  Add Result
                </Button>
              </ListItem>
            </List>
            <Divider className={classes.selectionListDivider} />
            <List className={classes.selectionList}>
              {questionnaireInEditor.questionnaire.variables.map((item, index) => (
                <ListItem
                  button
                  className={classes.listItem}
                  selected={activeItem.section === SectionType.VARIABLES && activeItem.index === index}
                  onClick={() => handleActiveItemChange(SectionType.VARIABLES, index)}
                  key={index}
                >
                  <ListItemText primary={item.id} />
                </ListItem>
              ))}
              <ListItem className={classes.listItem}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (questionnaireInEditor.hasErrors) {
                      setShowSnackbar(true);
                      return;
                    }
                    dispatch(addNewVariable());
                    handleActiveItemChange(SectionType.VARIABLES, questionnaireInEditor.questionnaire.variables.length);
                  }}
                >
                  Add Variable
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid container item xs={9} className={classes.formContainer}>
            {activeItem.section !== SectionType.META ? (
              <div className={classes.alignRight}>
                <IconButton aria-label="move-up" disabled={activeItem.index <= 0} onClick={handleMoveUp}>
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  aria-label="move-down"
                  disabled={activeItem.index >= questionnaireInEditor.questionnaire[activeItem.section].length - 1}
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
