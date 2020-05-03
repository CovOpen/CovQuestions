import React from "react";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import {
  editTestCase,
  questionnaireJsonSelector,
  testCaseInEditorSelector,
} from "../../../../store/questionnaireInEditor";
import {
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";
import { heightWithoutEditor } from "../../QuestionnaireEditor";
import { runOneTestCase } from "../../../../testCaseRunner/testCaseRunner";
import { TestCaseResult } from "./TestCaseResult";
import { ElementEditor } from "../../ElementEditor";
import { testCaseMetaSchema } from "./testCaseMeta";
import { AvailableItems, getQuestionIds, getResultCategoryIds } from "../../../../store/availableVariables";

type ElementEditorTestCaseProps = {
  index: number;
};

type EditorTestCaseMeta = Omit<TestCase, "answers" | "results">;

const useStyles = makeStyles(() =>
  createStyles({
    testCaseForm: {
      paddingLeft: "10px",
      height: `calc(100vh - ${heightWithoutEditor}px)`,
    },
    testCaseMetaFormEditor: {
      height: "auto",
    },
  })
);

type OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => void;

export function ElementEditorTestCase(props: ElementEditorTestCaseProps) {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const testCase = useSelector((state: RootState) => testCaseInEditorSelector(state, props));
  const availableResults = useSelector(getResultCategoryIds);
  const availableQuestions = useSelector(getQuestionIds);

  if (!testCase) {
    return null;
  }

  const uiSchema = {
    "ui:order": ["description", "*"],
  };

  const onResultItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedTestCase: TestCase = { ...testCase, results: { ...testCase.results, [itemId]: value } };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onAnswerItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedTestCase: TestCase = { ...testCase, answers: { ...testCase.answers, [itemId]: value } };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onTestCaseMetaChange = (formData: EditorTestCaseMeta, hasErrors: boolean) => {
    dispatch(editTestCase({ index: props.index, changedTestCase: { ...testCase, ...formData }, hasErrors }));
  };

  const getTestCaseMeta = ({ description, options }: TestCase): EditorTestCaseMeta => ({ description, options });

  return (
    <Grid container item direction={"column"} spacing={2} alignItems={"stretch"} xs={12}>
      <ElementEditor
        className={classes.testCaseMetaFormEditor}
        schema={testCaseMetaSchema}
        formData={getTestCaseMeta(testCase)}
        onChange={onTestCaseMetaChange}
        uiSchema={uiSchema}
      />
      <Typography>Answers</Typography>
      <AnswerOrResultEditor
        availableItems={availableQuestions}
        currentValues={testCase.answers}
        onResultItemChange={onAnswerItemChange}
      />
      <Typography>Results</Typography>
      <AnswerOrResultEditor
        availableItems={availableResults}
        currentValues={testCase.results}
        onResultItemChange={onResultItemChange}
      />
      <TestCaseResult testResult={runOneTestCase(questionnaireJson, testCase)} />
    </Grid>
  );
}

const AnswerOrResultEditor: React.FC<{
  availableItems: AvailableItems;
  currentValues: { [id: string]: any };
  onResultItemChange: OnItemChange;
}> = ({ currentValues, availableItems, onResultItemChange }) => {
  const useStyles = makeStyles(() => ({
    ul: {
      listStyleType: "none",
    },
  }));

  const classes = useStyles();

  const unusedItemIds = availableItems.map((it) => it.itemId).filter((it) => !Object.keys(currentValues).includes(it));
  return (
    <ul className={classes.ul}>
      {Object.entries(currentValues).map(([id, value]) => (
        <OneItem
          currentId={id}
          currentValue={value}
          availableIds={[id, ...unusedItemIds]}
          availableValues={availableItems.find((it) => it.itemId === id)?.possibleValues ?? []}
          onResultItemChange={onResultItemChange}
        />
      ))}
      <OneItem availableIds={unusedItemIds} availableValues={[]} onResultItemChange={onResultItemChange} />
    </ul>
  );
};

const OneItem: React.FC<{
  currentId?: string;
  currentValue?: any;
  availableIds: string[];
  availableValues: any[];
  onResultItemChange: OnItemChange;
}> = ({ currentId, currentValue, availableIds, availableValues, onResultItemChange }) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 240,
    },
  }));

  const classes = useStyles();

  return (
    <li>
      {currentId !== undefined ? (
        <FormControl className={classes.formControl}>
          <InputLabel id={"label-value-" + currentId}>{currentId}</InputLabel>
          <Select
            labelId={"label-value-" + currentId}
            id={"value-" + currentId}
            value={currentValue}
            onChange={(event) => onResultItemChange({ itemId: currentId, value: event.target.value as string })}
          >
            {availableValues.map((value) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
      {currentId === undefined && availableIds.length > 0 ? (
        <FormControl className={classes.formControl}>
          <InputLabel id={"label-new-itemId"}>Result Category</InputLabel>
          <Select
            labelId={"label-new-itemId"}
            id={"new-itemId"}
            onChange={(event) => onResultItemChange({ itemId: event.target.value as string, value: "" })}
          >
            {availableIds.map((itemId) => (
              <MenuItem value={itemId}>{itemId}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </li>
  );
};
