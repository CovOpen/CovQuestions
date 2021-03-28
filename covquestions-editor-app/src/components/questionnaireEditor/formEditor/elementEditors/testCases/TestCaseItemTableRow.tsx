import React from "react";
import { Question } from "@covopen/covquestions-js";
import { Button, TableCell, TableRow, Typography } from "@material-ui/core";
import { QuestionFormComponent } from "../../../../questionComponents/QuestionFormComponent";

type TestCaseItemTableRowProps = {
  label: any;
  onChange: (value: unknown) => void;
  id: string;
  value?: any;
  onDelete: () => void;
  item: Question;
};

export const TestCaseItemTableRow: React.FC<TestCaseItemTableRowProps> = (props) => {
  return (
    <TableRow>
      <TableCell key={"itemId"}>
        <Typography component={"span"}>{props.label}</Typography>
      </TableCell>
      <TableCell key={"value"}>
        <Typography>{props.item.text}</Typography>
        <QuestionFormComponent onChange={props.onChange} currentQuestion={props.item} value={props.value} />
      </TableCell>
      <TableCell key={"deleteButton"}>
        <Button onClick={props.onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};
