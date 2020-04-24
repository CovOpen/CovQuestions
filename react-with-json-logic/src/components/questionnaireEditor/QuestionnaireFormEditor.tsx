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
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AnyQuestion, Questionnaire, QuestionnaireMeta, ResultCategory, Variable } from "../../models/Questionnaire";
import { ElementEditorQuestion } from "./ElementEditorQuestion";
import { ElementEditorMeta } from "./ElementEditorMeta";
import { ElementEditorVariable } from "./ElementEditorVariable";
import { ElementEditorResultCategory } from "./ElementEditorResultCategory";
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
  setQuestionnaireInEditor,
  swapItemWithNextOne,
} from "../../store/questionnaireInEditor";

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
  // FIXME do not write to questionnaireInEditor below, but use actions instead, then remove JSON.parse(JSON.stringify())
  const questionnaireInEditor: Questionnaire = JSON.parse(JSON.stringify(useSelector(questionnaireInEditorSelector)));

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

  const style = `
    .rjsf > .MuiFormControl-root {
      height: calc(100vh - ${props.heightWithoutEditor + 48}px);
      overflow-x: hidden !important;
      overflow-x: auto;
    }
    .rjsf .MuiGrid-item {
      padding: 0px 8px 0px 8px;
    }
    `;

  useEffect(() => {
    if (activeItem.section === SectionType.META) {
      return;
    }
    const lengthOfActiveSection = questionnaireInEditor[activeItem.section].length;
    if (lengthOfActiveSection === 0) {
      setActiveItem({ section: SectionType.META, index: 0 });
    }
    if (activeItem.index >= lengthOfActiveSection) {
      setActiveItem({ section: activeItem.section, index: lengthOfActiveSection - 1 });
    }
  }, [activeItem, questionnaireInEditor]);

  const onChange = (newQuestionnaire: Questionnaire) => {
    dispatch(setQuestionnaireInEditor(newQuestionnaire));
  };

  const handleQuestionnaireMetaChanged = (value: QuestionnaireMeta) => {
    questionnaireInEditor.meta = value;
    onChange(questionnaireInEditor);
  };

  const handleQuestionChanged = (index: number, value: AnyQuestion) => {
    questionnaireInEditor.questions[index] = value;
    onChange(questionnaireInEditor);
  };

  const handleResultCategoryChanged = (index: number, value: ResultCategory) => {
    questionnaireInEditor.resultCategories[index] = value;
    onChange(questionnaireInEditor);
  };

  const handleVariableChanged = (index: number, value: Variable) => {
    questionnaireInEditor.variables[index] = value;
    onChange(questionnaireInEditor);
  };

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

  return (
    <Grid container direction="column">
      <style>{style}</style>
      <Grid container>
        <Grid container item xs={3} className={classes.selection}>
          <List className={classes.selectionList}>
            <ListItem
              className={classes.listItem}
              button
              selected={activeItem.section === SectionType.META}
              onClick={() => setActiveItem({ section: SectionType.META, index: 0 })}
            >
              <ListItemText primary="Meta" />
            </ListItem>
          </List>
          <Divider className={classes.selectionListDivider} />
          <List className={classes.selectionList}>
            {questionnaireInEditor?.questions !== undefined
              ? questionnaireInEditor.questions.map((item, index) => (
                  <ListItem
                    button
                    className={classes.listItem}
                    selected={activeItem.section === SectionType.QUESTIONS && activeItem.index === index}
                    onClick={() => setActiveItem({ section: SectionType.QUESTIONS, index })}
                    key={index}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))
              : null}
            <ListItem className={classes.listItem}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  dispatch(addNewQuestion());
                  setActiveItem({ section: SectionType.QUESTIONS, index: questionnaireInEditor.questions.length });
                }}
              >
                Add Question
              </Button>
            </ListItem>
          </List>
          <Divider className={classes.selectionListDivider} />
          <List className={classes.selectionList}>
            {questionnaireInEditor.resultCategories !== undefined
              ? questionnaireInEditor.resultCategories.map((item, index) => (
                  <ListItem
                    button
                    className={classes.listItem}
                    selected={activeItem.section === SectionType.RESULT_CATEGORIES && activeItem.index === index}
                    onClick={() => setActiveItem({ section: SectionType.RESULT_CATEGORIES, index })}
                    key={index}
                  >
                    <ListItemText primary={item.id} />
                  </ListItem>
                ))
              : null}
            <ListItem className={classes.listItem}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  dispatch(addNewResultCategory());
                  setActiveItem({
                    section: SectionType.RESULT_CATEGORIES,
                    index: questionnaireInEditor.resultCategories.length,
                  });
                }}
              >
                Add Result
              </Button>
            </ListItem>
          </List>
          <Divider className={classes.selectionListDivider} />
          <List className={classes.selectionList}>
            {questionnaireInEditor.variables !== undefined
              ? questionnaireInEditor.variables.map((item, index) => (
                  <ListItem
                    button
                    className={classes.listItem}
                    selected={activeItem.section === SectionType.VARIABLES && activeItem.index === index}
                    onClick={() => setActiveItem({ section: SectionType.VARIABLES, index })}
                    key={index}
                  >
                    <ListItemText primary={item.id} />
                  </ListItem>
                ))
              : null}
            <ListItem className={classes.listItem}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  dispatch(addNewVariable());
                  setActiveItem({ section: SectionType.VARIABLES, index: questionnaireInEditor.variables.length });
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
                disabled={activeItem.index >= questionnaireInEditor[activeItem.section].length - 1}
                onClick={handleMoveDown}
              >
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton aria-label="remove" onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
          {activeItem.section === SectionType.META ? (
            <ElementEditorMeta
              formData={questionnaireInEditor.meta || ({} as QuestionnaireMeta)}
              onChange={(formData) => handleQuestionnaireMetaChanged(formData)}
            />
          ) : null}
          {activeItem.section === SectionType.QUESTIONS && questionnaireInEditor.questions !== undefined ? (
            <ElementEditorQuestion
              formData={questionnaireInEditor.questions[activeItem.index]}
              onChange={(formData) => handleQuestionChanged(activeItem.index, formData)}
            />
          ) : null}
          {activeItem.section === SectionType.RESULT_CATEGORIES &&
          questionnaireInEditor.resultCategories !== undefined ? (
            <ElementEditorResultCategory
              formData={questionnaireInEditor.resultCategories[activeItem.index]}
              onChange={(formData) => handleResultCategoryChanged(activeItem.index, formData)}
            />
          ) : null}
          {activeItem.section === SectionType.VARIABLES && questionnaireInEditor.variables !== undefined ? (
            <ElementEditorVariable
              formData={questionnaireInEditor.variables[activeItem.index]}
              onChange={(formData) => handleVariableChanged(activeItem.index, formData)}
            />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
