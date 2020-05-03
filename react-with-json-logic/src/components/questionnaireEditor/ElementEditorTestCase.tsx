import React from "react";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { editTestCase, questionnaireJsonSelector, testCaseInEditorSelector } from "../../store/questionnaireInEditor";
import { createStyles, Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";
import { heightWithoutEditor } from "./QuestionnaireEditor";
import { runOneTestCase, TestResult } from "../../testCaseRunner/testCaseRunner";

type ElementEditorTestCaseProps = {
  index: number;
};

export function ElementEditorTestCase(props: ElementEditorTestCaseProps) {
  const useStyles = makeStyles(() =>
    createStyles({
      testCaseForm: {
        paddingLeft: "10px",
        height: `calc(100vh - ${heightWithoutEditor}px)`,
      },
    })
  );

  const dispatch = useAppDispatch();
  const classes = useStyles();

  const questionnaireJson = useSelector(questionnaireJsonSelector)
  const testCase = useSelector((state: RootState) => testCaseInEditorSelector(state, props));

  if (!testCase) {
    return null;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const changedTestCase = JSON.parse(event.target.value);
      dispatch(editTestCase({ index: props.index, changedTestCase: changedTestCase, hasErrors: false }));
    } catch (e) {
    }
  };

  const stringifyTestCase = (testCase: TestCase) => JSON.stringify(testCase, undefined, 2);

  return (
    <Grid container className={classes.testCaseForm} direction={"column"} spacing={2}>
      <Grid item>
        <TextField value={stringifyTestCase(testCase)} onChange={onChange} multiline={true} fullWidth={true}/>
      </Grid>
      <Grid item>
        <TestResultComponent testResult={runOneTestCase(questionnaireJson, testCase)}/>
      </Grid>
    </Grid>
  );
}

export const TestResultComponent: React.FC<{
  testResult?: TestResult;
}> = ({ testResult }) => {
  const useStyles = makeStyles(() =>
    createStyles({
      runResultHeading: {
        fontWeight: "bold",
      },
      runResultSuccess: {
        color: "green",
      },
      runResultError: {
        color: "red",
      },
      paperComponent: {
        padding: 12
      }
    })
  );

  const classes = useStyles();

  if (testResult === undefined) {
    return null
  }

  return (
    <Paper className={classes.paperComponent}>
      <div>
        <Typography className={classes.runResultHeading}>{testResult.description}</Typography>
      </div>
      <div>
        {testResult.success ? <Typography className={classes.runResultSuccess}>test run successful</Typography> :
          <Typography className={classes.runResultError}>{testResult.errorMessage}</Typography>}
      </div>
    </Paper>
  )
}
