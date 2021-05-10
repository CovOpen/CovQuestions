import React from "react";
import { Checkbox, FormControlLabel, FormGroup, makeStyles } from "@material-ui/core";
import { QuestionFormComponentProps } from "./QuestionFormComponent";
import { isPrimitive } from "@covopen/covquestions-js";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

export const MultiSelect: React.FC<QuestionFormComponentProps> = ({
  currentQuestion,
  onChange,
  value: checkedValues,
}) => {
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<{ value: unknown; checked: boolean }>) => {
    const current = e.target.value;
    let values = checkedValues ? [...checkedValues] : [];
    if (e.target.checked) {
      if (isPrimitive(current)) {
        values.push(current);
      }
    } else {
      values = values.filter((value) => value !== current);
    }
    onChange(values);
  };

  const options = (currentQuestion.options || []).map(({ value, text }) => ({
    value,
    text,
    checked: checkedValues?.includes(value) ?? false,
  }));

  return (
    <FormGroup>
      {options.map((answer) => (
        <FormControlLabel
          key={answer.value}
          value={answer.value}
          control={<Checkbox name="checkedC" onChange={handleChange} checked={answer.checked} />}
          label={answer.text}
          className={classes.root}
        />
      ))}
    </FormGroup>
  );
};
