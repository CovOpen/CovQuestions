import React, { useState } from "react";
import { Button, createStyles, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../../../../store/questionnaireInEditor";
import { TestCase, TestResult } from "@covopen/covquestions-js";
import Worker from "./backgroundWorker";

// Create new instance
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

  const [testResult, setTestResult] = useState<TestResult | undefined>(undefined);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runTestCase = async () => {
    setIsRunning(true);
    setTestResult(undefined);
    const instance = new Worker();
    setTestResult(await instance.runTestCase(questionnaireJson, testCase));
    setIsRunning(false);
  };

  if (!runManually && !isRunning && testResult === undefined) {
    runTestCase();
  }

  function renderRunButton() {
    return (
      <Button variant="contained" color="secondary" fullWidth={true} onClick={runTestCase} disabled={isRunning}>
        Run
      </Button>
    );
  }

  function renderTestCaseResult() {
    return (
      <>
        <div>
          <Typography className={classes.runResultHeading}>{testCase.description}</Typography>
        </div>
        <div>
          {isRunning ? <Typography>Running...</Typography> : null}
          {testResult !== undefined ? (
            testResult.success ? (
              <Typography className={classes.runResultSuccess}>test run successful</Typography>
            ) : (
              <Typography className={classes.runResultError}>
                {testResult.errorMessage}
                <br />
                {testResult.answers?.map((it) => (
                  <>
                    {it.questionId + ": " + it.rawAnswer}
                    <br />
                  </>
                ))}
              </Typography>
            )
          ) : null}
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
