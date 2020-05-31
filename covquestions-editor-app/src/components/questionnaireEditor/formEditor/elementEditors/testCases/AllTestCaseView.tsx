import React from "react";
import { TestCaseResult } from "./TestCaseResult";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../../../../store/questionnaireInEditor";
import { Grid } from "@material-ui/core";

export const AllTestCaseView: React.FC = () => {
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  return (
    <Grid container>
      {(questionnaireJson.testCases ?? []).map((testCase) => (
        <Grid item sm={12}>
          <TestCaseResult testCase={testCase} />
        </Grid>
      ))}
    </Grid>
  );
};
