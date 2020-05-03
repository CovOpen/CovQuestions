import React from "react";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editTestCase, testCaseInEditorSelector } from "../../store/questionnaireInEditor";
import { createStyles, Grid, makeStyles, TextField } from "@material-ui/core";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";
import { heightWithoutEditor } from "./QuestionnaireEditor";

type ElementEditorTestCaseProps = {
  index: number;
};

const useStyles = makeStyles(() =>
  createStyles({
    testCaseForm: {
      paddingLeft: "10px",
      height: `calc(100vh - ${heightWithoutEditor}px)`,
    },
  })
);

export function ElementEditorTestCase(props: ElementEditorTestCaseProps) {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const testCase = useSelector((state: RootState) => testCaseInEditorSelector(state, props));

  if (!testCase) {
    return null;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const changedTestCase = JSON.parse(event.target.value);
      dispatch(editTestCase({ index: props.index, changedTestCase: changedTestCase, hasErrors: false }));
    } catch (e) {}
  };

  const stringifyTestCase = (testCase: TestCase) => JSON.stringify(testCase, undefined, 2);

  return (
    <Grid container item className={classes.testCaseForm}>
      <TextField value={stringifyTestCase(testCase)} onChange={onChange} multiline={true} fullWidth={true} />
    </Grid>
  );
}
