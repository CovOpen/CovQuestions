import React from "react";
import { TestCaseResult } from "./TestCaseResult";
import { useSelector } from "react-redux";
import { questionnaireJsonSelector } from "../../../../../store/questionnaireInEditor";
import { Grid } from "@material-ui/core";

export enum ALL_TEST_CASES_RUN {
  ALL = 0,
  MANUALLY = 1,
}
type AllTestCaseViewProps = {
  index: ALL_TEST_CASES_RUN;
};

export const AllTestCaseView: React.FC<AllTestCaseViewProps> = (props) => {
  const questionnaireJson = useSelector(questionnaireJsonSelector);

  return (
    <Grid container>
      {(questionnaireJson.testCases ?? []).map((testCase) => (
        <Grid item sm={12}>
          <TestCaseResult testCase={testCase} runManually={props.index === 1} />
        </Grid>
      ))}
    </Grid>
  );
};
