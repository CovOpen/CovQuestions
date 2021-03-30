import React from "react";
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";

type AddTestCaseItemDropDownProps = {
  onChange: (value: any) => void;
  id: string;
  availableItems: any[];
  label?: string;
};

export const AddTestCaseItemDropDown: React.FC<AddTestCaseItemDropDownProps> = (props) => {
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
          <MenuItem key={JSON.stringify(item)} value={item?.toString()}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
