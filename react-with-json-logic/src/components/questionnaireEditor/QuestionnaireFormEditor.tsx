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

type QuestionnaireFormEditorProps = {
  value: Questionnaire | undefined;
  onChange: (value: Questionnaire) => void;
  heightWithoutEditor: number;
  addQuestion: () => number;
  addResultCategory: () => number;
  addVariable: () => number;
};

export type Selection = {
  type: string;
  index: number;
};

export function QuestionnaireFormEditor(props: QuestionnaireFormEditorProps) {
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
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({} as Questionnaire);
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

  const handleQuestionnaireMetaChanged = (value: QuestionnaireMeta) => {
    questionnaire.meta = value;
    props.onChange(questionnaire);
  };

  const handleQuestionChanged = (index: number, value: AnyQuestion) => {
    questionnaire.questions[index] = value;
    props.onChange(questionnaire);
  };

  const handleResultCategoryChanged = (index: number, value: ResultCategory) => {
    questionnaire.resultCategories[index] = value;
    props.onChange(questionnaire);
  };

  const handleVariableChanged = (index: number, value: Variable) => {
    questionnaire.variables[index] = value;
    props.onChange(questionnaire);
  };

  const handleListItemClick = (type: string, index?: number) => {
    if (type === "meta") {
      setActiveSelection({ type, index: 0 });
      return;
    }
    if (index === undefined) {
      return;
    }
    setActiveSelection({ type, index });
    setEnableMoveUp(index > 0);
    const questionnaireAsAny = questionnaire as any;
    setEnableMoveDown(index < questionnaireAsAny[type].length - 1);
  };

  const handleMoveUp = () => {
    let listPropertyName = activeSelection.type;
    const currentQuestionnaire: any = questionnaire;
    const currentIndex = activeSelection.index;
    const elementToMoveDown = currentQuestionnaire[listPropertyName][currentIndex - 1];
    currentQuestionnaire[listPropertyName][currentIndex - 1] = currentQuestionnaire[listPropertyName][currentIndex];
    currentQuestionnaire[listPropertyName][currentIndex] = elementToMoveDown;

    setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));
    handleListItemClick(activeSelection.type, currentIndex - 1);
    props.onChange(questionnaire);
  };

  const handleMoveDown = () => {
    let listPropertyName = activeSelection.type;
    const currentQuestionnaire: any = questionnaire;
    const currentIndex = activeSelection.index;
    const elementToMoveUp = currentQuestionnaire[listPropertyName][currentIndex + 1];
    currentQuestionnaire[listPropertyName][currentIndex + 1] = currentQuestionnaire[listPropertyName][currentIndex];
    currentQuestionnaire[listPropertyName][currentIndex] = elementToMoveUp;

    setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));
    handleListItemClick(activeSelection.type, currentIndex + 1);
    props.onChange(questionnaire);
  };

  const handleRemove = () => {
    let listPropertyName = activeSelection.type;
    const currentQuestionnaire: any = questionnaire;
    const currentIndex = activeSelection.index;
    currentQuestionnaire[listPropertyName].splice(currentIndex, 1);
    setQuestionnaire(JSON.parse(JSON.stringify(currentQuestionnaire)));

    if (currentQuestionnaire[listPropertyName].length === 0) {
      setActiveSelection({ type: "meta", index: 0 });
    } else if (currentQuestionnaire[listPropertyName].length <= currentIndex) {
      setActiveSelection({ type: listPropertyName, index: currentIndex - 1 });
    } else {
      setActiveSelection({ type: listPropertyName, index: currentIndex });
    }
  };

  useEffect(() => {
    if (props.value === undefined) {
      setQuestionnaire({} as Questionnaire);
    } else {
      setQuestionnaire(JSON.parse(JSON.stringify(props.value)));
    }
  }, [props.value]);

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
            {questionnaire.questions !== undefined
              ? questionnaire.questions.map((item, index) => (
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
                  const index = props.addQuestion();
                  handleListItemClick("questions", index);
                }}
              >
                Add Question
              </Button>
            </ListItem>
          </List>
          <Divider className={classes.selectionListDivider} />
          <List className={classes.selectionList}>
            {questionnaire.resultCategories !== undefined
              ? questionnaire.resultCategories.map((item, index) => (
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
                  const index = props.addResultCategory();
                  handleListItemClick("resultCategories", index);
                }}
              >
                Add Result
              </Button>
            </ListItem>
          </List>
          <Divider className={classes.selectionListDivider} />
          <List className={classes.selectionList}>
            {questionnaire.variables !== undefined
              ? questionnaire.variables.map((item, index) => (
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
                  const index = props.addVariable();
                  handleListItemClick("variables", index);
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
              formData={questionnaire.meta || ({} as QuestionnaireMeta)}
              onChange={(formData) => handleQuestionnaireMetaChanged(formData)}
            />
          ) : null}
          {activeSelection.type === "questions" && questionnaire.questions !== undefined ? (
            <ElementEditorQuestion
              formData={questionnaire.questions[activeSelection.index]}
              onChange={(formData) => handleQuestionChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "resultCategories" && questionnaire.resultCategories !== undefined ? (
            <ElementEditorResultCategory
              formData={questionnaire.resultCategories[activeSelection.index]}
              onChange={(formData) => handleResultCategoryChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "variables" && questionnaire.variables !== undefined ? (
            <ElementEditorVariable
              formData={questionnaire.variables[activeSelection.index]}
              onChange={(formData) => handleVariableChanged(activeSelection.index, formData)}
            />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
