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
import React, { useState } from "react";
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
  setQuestionnaireInEditor,
} from "../../store/questionnaireInEditor";

type QuestionnaireFormEditorProps = {
  heightWithoutEditor: number;
};

export type Selection = {
  type: string;
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

  const [activeSelection, setActiveSelection] = useState<Selection>({ type: "meta", index: 0 });
  const [enableMoveUp, setEnableMoveUp] = useState(false);
  const [enableMoveDown, setEnableMoveDown] = useState(false);

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

  const handleListItemClick = (type: "meta" | "questions" | "resultCategories" | "variables", index?: number) => {
    if (type === "meta") {
      setActiveSelection({ type, index: 0 });
      return;
    }
    if (index === undefined) {
      return;
    }
    setActiveSelection({ type, index });
    setEnableMoveUp(index > 0);
    setEnableMoveDown(index < questionnaireInEditor[type].length - 1);
  };

  const handleMoveUp = () => {
    // let listPropertyName = activeSelection.type;
    // const currentQuestionnaire: any = questionnaire;
    // const currentIndex = activeSelection.index;
    // const elementToMoveDown = currentQuestionnaire[listPropertyName][currentIndex - 1];
    // currentQuestionnaire[listPropertyName][currentIndex - 1] = currentQuestionnaire[listPropertyName][currentIndex];
    // currentQuestionnaire[listPropertyName][currentIndex] = elementToMoveDown;
    //
    // setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));
    // handleListItemClick(activeSelection.type, currentIndex - 1);
    // onChange(questionnaire);
  };

  const handleMoveDown = () => {
    // let listPropertyName = activeSelection.type;
    // const currentQuestionnaire: any = questionnaire;
    // const currentIndex = activeSelection.index;
    // const elementToMoveUp = currentQuestionnaire[listPropertyName][currentIndex + 1];
    // currentQuestionnaire[listPropertyName][currentIndex + 1] = currentQuestionnaire[listPropertyName][currentIndex];
    // currentQuestionnaire[listPropertyName][currentIndex] = elementToMoveUp;
    //
    // setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));
    // handleListItemClick(activeSelection.type, currentIndex + 1);
    // onChange(questionnaire);
  };

  const handleRemove = () => {
    // let listPropertyName = activeSelection.type;
    // const currentQuestionnaire: any = questionnaire;
    // const currentIndex = activeSelection.index;
    // currentQuestionnaire[listPropertyName].splice(currentIndex, 1);
    // setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));
    //
    // if (currentQuestionnaire[listPropertyName].length === 0) {
    //   setActiveSelection({ type: "meta", index: 0 });
    // } else if (currentQuestionnaire[listPropertyName].length <= currentIndex) {
    //   setActiveSelection({ type: listPropertyName, index: currentIndex - 1 });
    // } else {
    //   setActiveSelection({ type: listPropertyName, index: currentIndex });
    // }
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
              selected={activeSelection.type === "meta"}
              onClick={() => setActiveSelection({ type: "meta", index: 0 })}
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
                    selected={activeSelection.type === "questions" && activeSelection.index === index}
                    onClick={() => handleListItemClick("questions", index)}
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
                  handleListItemClick("questions", questionnaireInEditor.questions.length);
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
                    selected={activeSelection.type === "resultCategories" && activeSelection.index === index}
                    onClick={() => handleListItemClick("resultCategories", index)}
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
                  handleListItemClick("resultCategories", questionnaireInEditor.resultCategories.length);
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
                    selected={activeSelection.type === "variables" && activeSelection.index === index}
                    onClick={() => handleListItemClick("variables", index)}
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
                  handleListItemClick("variables", questionnaireInEditor.variables.length);
                }}
              >
                Add Variable
              </Button>
            </ListItem>
          </List>
        </Grid>
        <Grid container item xs={9} className={classes.formContainer}>
          {["questions", "resultCategories", "variables"].indexOf(activeSelection.type) > -1 ? (
            <div className={classes.alignRight}>
              <IconButton aria-label="move-up" disabled={!enableMoveUp} onClick={handleMoveUp}>
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton aria-label="move-down" disabled={!enableMoveDown} onClick={handleMoveDown}>
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton aria-label="remove" onClick={handleRemove}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
          {activeSelection.type === "meta" ? (
            <ElementEditorMeta
              formData={questionnaireInEditor.meta || ({} as QuestionnaireMeta)}
              onChange={(formData) => handleQuestionnaireMetaChanged(formData)}
            />
          ) : null}
          {activeSelection.type === "questions" && questionnaireInEditor.questions !== undefined ? (
            <ElementEditorQuestion
              formData={questionnaireInEditor.questions[activeSelection.index]}
              onChange={(formData) => handleQuestionChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "resultCategories" && questionnaireInEditor.resultCategories !== undefined ? (
            <ElementEditorResultCategory
              formData={questionnaireInEditor.resultCategories[activeSelection.index]}
              onChange={(formData) => handleResultCategoryChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "variables" && questionnaireInEditor.variables !== undefined ? (
            <ElementEditorVariable
              formData={questionnaireInEditor.variables[activeSelection.index]}
              onChange={(formData) => handleVariableChanged(activeSelection.index, formData)}
            />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
