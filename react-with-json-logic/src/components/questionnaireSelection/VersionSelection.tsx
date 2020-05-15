import React from "react";
import { makeStyles, Theme, createStyles, Select, MenuItem, Typography } from "@material-ui/core";

type VersionSelectionProps = {
  handleChange: (value: number) => void;
  availableVersions: number[];
  selectedValue: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      alignItems: "center",
      display: "inline-flex",
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
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

export const VersionSelection: React.FC<VersionSelectionProps> = ({
  handleChange,
  availableVersions,
  selectedValue,
}) => {
  const classes = useStyles();

  if (availableVersions.length === 0) {
    return null;
  }

  return (
    <div className={classes.formControl}>
      <Typography className={classes.label}>Version</Typography>
      <Select
        labelId="version-label"
        id="version-select"
        value={selectedValue}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleChange(event.target.value as number)}
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {availableVersions.map((it) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
