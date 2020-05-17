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
import {
  AnyQuestion,
  QuestionWithOptions,
  ResultCategory,
  TestCase,
} from "covquestions-js/models/Questionnaire.generated";
import { heightWithoutEditor } from "../../QuestionnaireEditor";
import { runOneTestCase } from "covquestions-js/src/testCaseRunner";
import { TestCaseResult } from "./TestCaseResult";
import { ElementEditor } from "../../ElementEditor";
import { testCaseMetaSchema } from "./testCaseMeta";
import { QuestionFormComponent } from "../../../questionComponents/QuestionFormComponent";

type ElementEditorTestCaseProps = {
  index: number;
};

type EditorTestCaseMeta = Omit<TestCase, "answers" | "results">;

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      paddingLeft: 10,
    },
    testCaseForm: {
      height: `calc(100vh - ${heightWithoutEditor}px - 150px)`,
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

type OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => void;

export const ElementEditorTestCase: React.FC<ElementEditorTestCaseProps> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const questionnaireJson = useSelector(questionnaireJsonSelector);
  const testCase = useSelector((state: RootState) => testCaseInEditorSelector(state, props));
  const availableResults = questionnaireJson.resultCategories.map(
    (category: ResultCategory): QuestionWithOptions => ({
      id: category.id,
      type: "select",
      text: category.description,
      options: category.results.map((result) => ({ value: result.id, text: result.text })),
    })
  );
  const availableQuestions = questionnaireJson.questions;

  if (!testCase) {
    return null;
  }

  const uiSchema = {
    "ui:order": ["description", "*"],
  };

  const onResultItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedResults = { ...testCase.results, [itemId]: value };
    removeUndefined(changedResults);
    const changedTestCase: TestCase = { ...testCase, results: changedResults };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onAnswerItemChange: OnItemChange = ({ itemId, value }: { itemId: string; value: any }) => {
    const changedAnswers = { ...testCase.answers, [itemId]: value };
    removeUndefined(changedAnswers);
    const changedTestCase: TestCase = { ...testCase, answers: changedAnswers };
    dispatch(editTestCase({ index: props.index, changedTestCase, hasErrors: false }));
  };

  const onTestCaseMetaChange = (formData: EditorTestCaseMeta, hasErrors: boolean) => {
    dispatch(editTestCase({ index: props.index, changedTestCase: { ...testCase, ...formData }, hasErrors }));
  };

  const getTestCaseMeta = ({ description, options }: TestCase): EditorTestCaseMeta => ({ description, options });

  return (
    <Grid container item className={classes.container} spacing={2} alignItems={"stretch"} xs={12}>
      <div className={classes.testCaseForm}>
        <ElementEditor
          className={classes.testCaseMetaFormEditor}
          schema={testCaseMetaSchema}
          formData={getTestCaseMeta(testCase)}
          onChange={onTestCaseMetaChange}
          uiSchema={uiSchema}
          addAdditionalValidationErrors={() => {}}
        />
        <Grid container item direction={"column"} alignItems={"stretch"} xs={12}>
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
        </Grid>
      </div>
      <TestCaseResult className={classes.testCaseResult} testResult={runOneTestCase(questionnaireJson, testCase)} />
    </Grid>
  );
};

const DropDownInput: React.FC<{
  onChange: (value: any) => void;
  id: string;
  availableItems: any[];
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
        value={""}
        onChange={(event) => props.onChange(event.target.value)}
        onBlur={(event) => props.onChange(event.target.value)}
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
  onDelete: () => void;
  item: AnyQuestion;
}> = (props) => {
  return (
    <TableRow>
      <TableCell key={"itemId"}>
        <Typography component={"span"}>{props.label}</Typography>
      </TableCell>
      <TableCell key={"value"}>
        <QuestionFormComponent onChange={props.onChange} currentQuestion={props.item} value={props.value} />
      </TableCell>
      <TableCell key={"deleteButton"}>
        <Button onClick={props.onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

const AnswerOrResultEditor: React.FC<{
  availableItems: AnyQuestion[];
  currentStoreItems: { [id: string]: any };
  onItemChange: OnItemChange;
}> = ({ currentStoreItems, availableItems, onItemChange }) => {
  const [additionalItems, setAdditionalItems] = useState<string[]>([]);

  const useStyles = makeStyles(() => ({
    table: {
      minWidth: 450,
    },
  }));

  const classes = useStyles();

  function onItemAdd(id: string) {
    setAdditionalItems((items) => [...items, id]);
  }

  function onItemDelete(id: string) {
    setAdditionalItems((items) => items.filter((item) => item !== id));
    onItemChange({ itemId: id, value: undefined });
  }

  function onValueChange(id: string, value: any) {
    setAdditionalItems((items) => unique([...items, id]));
    onItemChange({ itemId: id, value: value as string });
  }

  const itemIdInStoreWithDefinedValue = Object.entries(currentStoreItems)
    .filter(([_, value]) => value !== undefined)
    .map(([id, _]) => id);
  const displayedItemIds = unique([...itemIdInStoreWithDefinedValue, ...additionalItems]);

  const unusedItemIds = availableItems.map((it) => it.id).filter((it) => !displayedItemIds.includes(it));

  const sortedItemIds = availableItems.map(({ id }) => id).filter((id) => displayedItemIds.includes(id));

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableBody>
            {sortedItemIds.map((id) => (
              <OneItemRow
                id={id}
                key={id}
                value={currentStoreItems[id]}
                label={id}
                onChange={(value) => onValueChange(id, value)}
                onDelete={() => onItemDelete(id)}
                item={availableItems.find((it) => it.id === id)!}
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

function unique(array: any[]) {
  return array.filter((v, i, a) => a.indexOf(v) === i);
}

function removeUndefined(obj: object) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
}
