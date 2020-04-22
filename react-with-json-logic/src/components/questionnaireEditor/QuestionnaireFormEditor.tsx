import { Button, createStyles, Divider, Grid, List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AnyQuestion, Questionnaire, QuestionnaireMeta, ResultCategory, Variable } from "../../models/Questionnaire";
import { ElementEditorQuestion } from "./ElementEditorQuestion";
import { ElementEditorMeta } from "./ElementEditorMeta";
import { ElementEditorVariable } from "./ElementEditorVariable";
import { ElementEditorResultCategory } from "./ElementEditorResultCategory";

type QuestionnaireFormEditorProps = {
  value: Questionnaire | undefined;
  onChange: (value: Questionnaire) => void;
  formHeight: string;
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
        height: props.formHeight,
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
        height: props.formHeight,
      },
    })
  );

  const classes = useStyles();

  const [activeSelection, setActiveSelection] = useState<Selection>({ type: "meta", index: 0 });
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({} as Questionnaire);

  const style = `
    .rjsf > .MuiFormControl-root {
      height: ${props.formHeight};
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

  useEffect(() => {
    if (props.value === undefined) {
      setQuestionnaire({} as Questionnaire);
    } else {
      setQuestionnaire(props.value);
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
                    selected={activeSelection.type === "question" && activeSelection.index === index}
                    onClick={() => setActiveSelection({ type: "question", index })}
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
                  setActiveSelection({ type: "question", index });
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
                    selected={activeSelection.type === "resultCategory" && activeSelection.index === index}
                    onClick={() => setActiveSelection({ type: "resultCategory", index })}
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
                  setActiveSelection({ type: "resultCategory", index });
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
                    selected={activeSelection.type === "variable" && activeSelection.index === index}
                    onClick={() => setActiveSelection({ type: "variable", index })}
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
                  setActiveSelection({ type: "variable", index });
                }}
              >
                Add Variable
              </Button>
            </ListItem>
          </List>
        </Grid>
        <Grid container item xs={9} className={classes.formContainer}>
          {activeSelection.type === "meta" ? (
            <ElementEditorMeta
              formData={questionnaire.meta || ({} as QuestionnaireMeta)}
              onChange={(formData) => handleQuestionnaireMetaChanged(formData)}
            />
          ) : null}
          {activeSelection.type === "question" && questionnaire.questions !== undefined ? (
            <ElementEditorQuestion
              formData={questionnaire.questions[activeSelection.index]}
              onChange={(formData) => handleQuestionChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "resultCategory" && questionnaire.resultCategories !== undefined ? (
            <ElementEditorResultCategory
              formData={questionnaire.resultCategories[activeSelection.index]}
              onChange={(formData) => handleResultCategoryChanged(activeSelection.index, formData)}
            />
          ) : null}
          {activeSelection.type === "variable" && questionnaire.variables !== undefined ? (
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
