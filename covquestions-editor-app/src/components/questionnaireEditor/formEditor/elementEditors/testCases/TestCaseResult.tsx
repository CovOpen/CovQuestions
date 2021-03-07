import React, { useState } from "react";
import { Button, createStyles, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../../../../store/questionnaireInEditor";
import { runOneTestCase, TestCase, TestResult } from "@covopen/covquestions-js";

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
      padding: 8,
    },
  })
);

type TestCaseResultProps = {
  testCase: TestCase;
  runManually: boolean;
  className?: string;
};

export const TestCaseResult: React.FC<TestCaseResultProps> = ({ testCase, className, runManually }) => {
  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const classes = useStyles();

  const initialTestResult = runManually ? undefined : runOneTestCase(questionnaireJson, testCase);
  const [testResult, setTestResult] = useState<TestResult | undefined>(initialTestResult);

  function runTestCaseManually() {
    setTestResult(runOneTestCase(questionnaireJson, testCase));
  }

  function renderRunButton() {
    return (
      <Button variant="contained" color="secondary" fullWidth={true} onClick={runTestCaseManually}>
        Run
      </Button>
    );
  }

  function renderTestCaseResult() {
    if (testResult === undefined) {
      return null;
    }

    return (
      <>
        <div>
          <Typography className={classes.runResultHeading}>{testResult.description}</Typography>
        </div>
        <div>
          {testResult.success ? (
            <Typography className={classes.runResultSuccess}>test run successful</Typography>
          ) : (
            <Typography className={classes.runResultError}>{testResult.errorMessage}</Typography>
          )}
        </div>
      </>
    );
  }

  return (
    <Paper className={`${classes.paperComponent} ${className || ""}`}>
      <Grid container item xs={12} spacing={2} direction={"row"} alignItems={"center"}>
        <Grid item xs={6} sm={3} md={2} xl={1}>
          {renderRunButton()}
        </Grid>
        <Grid item>{renderTestCaseResult()}</Grid>
      </Grid>
    </Paper>
  );
};
