import React from "react";
import { List, ListItem, ListItemText, makeStyles, Theme, createStyles } from "@material-ui/core";
import { ISOLanguage } from "covquestions-js/models/Questionnaire.generated";
import { QuestionnairesList, QuestionnaireBaseData } from "../models/QuestionnairesList";

export type QuestionnaireSelection = {
  id?: string;
  version?: number;
  language?: ISOLanguage;
};

type QuestionnaireSelectionProps = {
  handleChange: React.Dispatch<React.SetStateAction<QuestionnaireSelection>>;
  allQuestionnaires: QuestionnairesList | undefined;
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

  const getLatestVersion = (list: QuestionnaireBaseData[]): QuestionnaireBaseData | undefined => {
    const versions = list.map((it) => it.version);
    const latest = Math.max(...versions);
    const filtered = list.filter((it) => it.version === latest);
    if (filtered.length > 0) {
      return filtered[0];
    }
    return undefined;
  };

  if (allQuestionnaires === undefined || Object.keys(allQuestionnaires).length === 0) {
    return <div className={classes.root}>No questionnaires available</div>;
  }

  return (
    <div className={classes.root}>
      <List>
        {Object.keys(allQuestionnaires).map((id) => {
          const latest = getLatestVersion(allQuestionnaires[id]);
          if (latest === undefined) {
            return <></>;
          }
          return (
            <ListItem
              onClick={() => handleOnClick(latest)}
              selected={selectedValue.id === latest.id && selectedValue.version === latest.version}
              button
              key={latest.path}
            >
              <ListItemText primary={latest.title} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
