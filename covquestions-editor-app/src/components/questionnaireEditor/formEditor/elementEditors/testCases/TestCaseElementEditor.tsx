import React from "react";
import { RootState, useAppDispatch } from "../../../../../store/store";
import { useSelector } from "react-redux";
import {
  editTestCase,
  questionnaireJsonSelector,
  testCaseInEditorSelector,
} from "../../../../../store/questionnaireInEditor";
import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import {
  Question,
  QuestionWithOptions,
  ResultCategory,
  TestCase,
} from "@covopen/covquestions-js/src/models/Questionnaire.generated";
import { TestCaseResult } from "./TestCaseResult";
import { ElementEditor } from "../ElementEditor";
import { testCaseMetaSchema } from "./testCaseMetaSchema";
import { OnItemChange, TestCaseItemsEditor } from "./TestCaseItemsEditor";

type TestCaseElementEditorProps = {
  index: number;
};

type TestCaseMetaEditor = Omit<TestCase, "answers" | "results">;

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      paddingLeft: 10,
    },
    testCaseForm: {
      overflowY: "auto",
      overflowX: "hidden",
    },
    testCaseMetaFormEditor: {
      height: "auto",
    },
    testCaseResult: {
      width: "100%",
    },
  })
);

export const TestCaseElementEditor: React.FC<TestCaseElementEditorProps> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const testCase = useSelector((state: RootState) => testCaseInEditorSelector(state, props));

  // Results and variables are mapped to the Question type to have a unified editor
  const availableResults: Question[] = questionnaireJson.resultCategories.map(
    (category: ResultCategory): QuestionWithOptions => ({
      id: category.id,
      type: "select",
      text: category.description,
      options: category.results.map((result) => ({
        value: result.id,
        text: result.text,
      })),
    })
  );
  const availableVariables: Question[] = questionnaireJson.variables.map((variable) => ({
    id: variable.id,
    type: "text",
    text: variable.id,
  }));
  const availableQuestions: Question[] = questionnaireJson.questions;

  if (!testCase) {
    return null;
  }

  const uiSchema = {
    "ui:order": ["description", "*"],
    options: {
      strictResults: {
        "ui:help":
          "If false (default), the provided results have to appear after the questionnaire execution, additional results are allowed. If set, exactly the provided results have to appear.",
      },
    },
  };

  const onResultItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedResults = { ...testCase.results, [itemId]: value };
    removeUndefined(changedResults);
    const changedTestCase: TestCase = { ...testCase, results: changedResults };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onVariableItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedVariables = { ...testCase.variables, [itemId]: value };
    removeUndefined(changedVariables);
    const changedTestCase: TestCase = {
      ...testCase,
      variables: changedVariables,
    };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onAnswerItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedAnswers = { ...testCase.answers, [itemId]: value };
    removeUndefined(changedAnswers);
    const changedTestCase: TestCase = { ...testCase, answers: changedAnswers };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onTestCaseMetaChange = (formData: TestCaseMetaEditor, hasErrors: boolean) => {
    dispatch(
      editTestCase({
        index: props.index,
        changedTestCase: { ...testCase, ...formData },
        hasErrors,
      })
    );
  };

  const getTestCaseMeta = ({ description, options }: TestCase): TestCaseMetaEditor => ({ description, options });

  return (
    <Grid container item className={classes.container} spacing={2} alignItems={"stretch"} xs={12}>
      <div className={classes.testCaseForm}>
        <ElementEditor
          id={`editor-testcase-${props.index}`}
          className={classes.testCaseMetaFormEditor}
          schema={testCaseMetaSchema}
          formData={getTestCaseMeta(testCase)}
          onChange={onTestCaseMetaChange}
          uiSchema={uiSchema}
          addAdditionalValidationErrors={() => {}}
        />
        <Grid container item direction={"column"} alignItems={"stretch"} xs={12}>
          <Typography variant={"h6"}>Answers</Typography>
          <TestCaseItemsEditor
            key={"answerEditor"}
            availableItems={availableQuestions}
            currentStoreItems={testCase.answers}
            onItemChange={onAnswerItemChange}
          />
          <Typography variant={"h6"}>Results</Typography>
          <TestCaseItemsEditor
            key={"resultEditor"}
            availableItems={availableResults}
            currentStoreItems={testCase.results}
            onItemChange={onResultItemChange}
          />
          <Typography variant={"h6"}>Variables</Typography>
          <TestCaseItemsEditor
            key={"variableEditor"}
            availableItems={availableVariables}
            currentStoreItems={testCase.variables ?? {}}
            onItemChange={onVariableItemChange}
          />
        </Grid>
      </div>
      <TestCaseResult className={classes.testCaseResult} testCase={testCase} runManually={true} />
    </Grid>
  );
};

function removeUndefined(obj: object) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
}
