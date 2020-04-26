import React from "react";
import { List, ListItem, ListItemText, makeStyles, Theme, createStyles } from "@material-ui/core";

type QuestionnaireSelectionProps = {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  allQuestionnaires: any[];
  selectedValue: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "rgba(237, 242, 247, 0.7)",
      height: "100%",
      marginRight: 12,
    },
  })
);

export const QuestionnaireSelectionDrawer: React.FC<QuestionnaireSelectionProps> = ({
  handleChange,
  allQuestionnaires,
  selectedValue,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List>
        {allQuestionnaires.map((it) => (
          <ListItem onClick={() => handleChange(it.path)} selected={selectedValue === it.path} button key={it.path}>
            <ListItemText primary={it.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
