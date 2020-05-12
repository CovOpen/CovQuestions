import React from "react";
import { List, ListItem, ListItemText, makeStyles, Theme, createStyles } from "@material-ui/core";
import { ISOLanguage } from "covquestions-js/models/Questionnaire.generated";

export type QuestionnaireSelection = {
  id?: string;
  version?: number;
  language?: ISOLanguage;
};

type QuestionnaireSelectionProps = {
  handleChange: React.Dispatch<React.SetStateAction<QuestionnaireSelection>>;
  allQuestionnaires: any[];
  selectedValue: QuestionnaireSelection;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "rgba(237, 242, 247, 0.7)",
      height: "100%",
      border: "1.5px solid #CBD5E0",
      boxSizing: "border-box",
      borderRadius: 6,
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
          <ListItem
            onClick={() => handleChange({ id: it.id, version: it.version, language: "de" })}
            selected={
              selectedValue.id === it.id &&
              selectedValue.version === it.version &&
              selectedValue.language === it.language
            }
            button
            key={it.path}
          >
            <ListItemText primary={it.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
