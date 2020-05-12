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

  const handleOnClick = (questionnaireData: any) => {
    const browserLanguage = navigator.language.split("-")[0] as ISOLanguage;
    const selection: QuestionnaireSelection = { id: questionnaireData.id, version: questionnaireData.version };
    const availableLanguages = questionnaireData.meta.availableLanguages;
    if (availableLanguages.indexOf(browserLanguage) > -1) {
      selection.language = browserLanguage;
    } else if (availableLanguages.indexOf("en") > -1) {
      selection.language = "en";
    } else {
      selection.language = availableLanguages[0];
    }
    handleChange(selection);
  };

  return (
    <div className={classes.root}>
      <List>
        {allQuestionnaires.map((it) => (
          <ListItem
            onClick={() => handleOnClick(it)}
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
