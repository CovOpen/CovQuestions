import React from "react";
import { makeStyles, Theme, createStyles, Select, MenuItem, Typography } from "@material-ui/core";

type SettingSelectionProps = {
  handleChange: (value: number | string) => void;
  values: number[] | string[];
  selectedValue: number | string;
  title: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      alignItems: "center",
      display: "inline-flex",
      marginRight: theme.spacing(2),
    },
    label: {
      marginRight: theme.spacing(1),
    },
    select: {
      color: "white",
      "&:before": {
        borderColor: "white",
      },
      "&:after": {
        borderColor: "white",
      },
    },
    icon: {
      fill: "white",
    },
  })
);

export const SettingSelection: React.FC<SettingSelectionProps> = ({ handleChange, values, selectedValue, title }) => {
  const classes = useStyles();

  if (values.length === 0) {
    return null;
  }

  return (
    <div className={classes.formControl}>
      <Typography className={classes.label}>{title}</Typography>
      <Select
        labelId="version-label"
        id="version-select"
        value={selectedValue}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleChange(event.target.value as number | string)}
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {(values as []).map((it) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
