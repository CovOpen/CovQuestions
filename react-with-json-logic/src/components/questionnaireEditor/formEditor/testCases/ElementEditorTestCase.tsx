import React, { useState } from "react";
import { RootState, useAppDispatch } from "../../../../store/store";
import { useSelector } from "react-redux";
import {
  editTestCase,
  questionnaireJsonSelector,
  testCaseInEditorSelector,
} from "../../../../store/questionnaireInEditor";
import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { TestCase } from "covquestions-js/models/Questionnaire.generated";
import { heightWithoutEditor } from "../../QuestionnaireEditor";
import { runOneTestCase } from "../../../../testCaseRunner/testCaseRunner";
import { TestCaseResult } from "./TestCaseResult";
import { ElementEditor } from "../../ElementEditor";
import { testCaseMetaSchema } from "./testCaseMeta";
import { AvailableItems, getQuestionIds, getResultCategoryIds } from "../../../../store/availableVariables";
import { notUndefined } from "../../../../utils/notUndefined";

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

export const ElementEditorTestCase: React.FC<ElementEditorTestCaseProps> = (props) => {
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
      <Typography variant={"h6"}>Answers</Typography>
      <AnswerOrResultEditor
        key={"answerEditor"}
        availableItems={availableQuestions}
        currentStoreItems={testCase.answers}
        onItemChange={onAnswerItemChange}
      />
      <Typography variant={"h6"}>Results</Typography>
      <AnswerOrResultEditor
        key={"resultEditor"}
        availableItems={availableResults}
        currentStoreItems={testCase.results}
        onItemChange={onResultItemChange}
      />
      <TestCaseResult testResult={runOneTestCase(questionnaireJson, testCase)} />
    </Grid>
  );
};

function mapToInitialItems(currentValues: { [id: string]: any }): { id: string; value: any }[] {
  return Object.entries(currentValues).map(([id, value]) => ({ id, value }));
}

const DropDownInput: React.FC<{
  onChange: (value: any) => void;
  id: string;
  availableItems: any[];
  value?: any;
  label?: string;
}> = (props) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 240,
    },
  }));

  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={props.id + "-label"}>{props.label}</InputLabel>
      <Select
        key={props.id}
        id={props.id}
        labelId={props.id + "-label"}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      >
        {props.availableItems.map((item) => (
          <MenuItem key={JSON.stringify(item)} value={(item as any).toString()}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const OneItemRow: React.FC<{
  label: any;
  onChange: (value: unknown) => void;
  id: string;
  value?: any;
  availableItems: string[];
  onDelete: () => void;
}> = (props) => {
  return (
    <TableRow key={props.id}>
      <TableCell key={"itemId"}>
        <Typography component={"span"}>{props.label}</Typography>
      </TableCell>
      <TableCell key={"value"}>
        <DropDownInput
          onChange={props.onChange}
          id={props.id}
          availableItems={props.availableItems}
          value={props.value}
        />
      </TableCell>
      <TableCell key={"deleteButton"}>
        <Button onClick={props.onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

const AnswerOrResultEditor: React.FC<{
  availableItems: AvailableItems;
  currentStoreItems: { [id: string]: any };
  onItemChange: OnItemChange;
}> = ({ currentStoreItems, availableItems, onItemChange }) => {
  const [currentItems, setCurrentItems] = useState(mapToInitialItems(currentStoreItems));

  const useStyles = makeStyles(() => ({
    table: {
      minWidth: 450,
    },
  }));

  const classes = useStyles();

  function onItemAdd(id: string) {
    setCurrentItems((items) => [...items, { id, value: undefined }]);
  }

  function onItemDelete(id: string) {
    setCurrentItems((items) => items.filter((item) => item.id !== id));
    onItemChange({ itemId: id, value: undefined });
  }

  function onValueChange(id: string, value: any) {
    setCurrentItems((items) => items.map((item) => (item.id === id ? { id, value } : item)));
    onItemChange({ itemId: id, value: value as string });
  }

  const unusedItemIds = availableItems
    .map((it) => it.itemId)
    .filter((it) => !currentItems.map(({ id }) => id).includes(it));

  const sortedCurrentItems = availableItems
    .filter(({ itemId }) => currentItems.map(({ id }) => id).includes(itemId))
    .map(({ itemId }) => currentItems.find(({ id }) => id === itemId))
    .filter(notUndefined);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableBody>
            {sortedCurrentItems.map(({ id, value }) => (
              <OneItemRow
                id={id}
                value={value}
                label={id}
                onChange={(value) => onValueChange(id, value)}
                onDelete={() => onItemDelete(id)}
                availableItems={availableItems.find((it) => it.itemId === id)?.possibleValues ?? []}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {unusedItemIds.length > 0 ? (
        <DropDownInput id={"newItem"} onChange={onItemAdd} availableItems={unusedItemIds} label={"Add item"} />
      ) : null}
    </>
  );
};
