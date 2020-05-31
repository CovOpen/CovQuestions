import React from "react";
import { runOneTestCase } from "covquestions-js/src/testCaseRunner";
import { createStyles, makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../../../../store/questionnaireInEditor";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";

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
      padding: 12,
    },
  })
);

type TestCaseResultProps = {
  testCase?: TestCase;
  className?: string;
};

export const TestCaseResult: React.FC<TestCaseResultProps> = ({ testCase, className }) => {
  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const classes = useStyles();

  if (testCase === undefined) {
    return null;
  }

  const testResult = runOneTestCase(questionnaireJson, testCase);

  return (
    <Paper className={`${classes.paperComponent} ${className || ""}`}>
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
    </Paper>
  );
};
