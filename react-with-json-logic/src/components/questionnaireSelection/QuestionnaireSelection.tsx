import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, makeStyles, Theme, createStyles, Typography } from "@material-ui/core";
import { ISOLanguage } from "covquestions-js/models/Questionnaire.generated";
import { QuestionnaireBaseData } from "../../models/QuestionnairesList";

export type QuestionnaireSelection = {
  id?: string;
  version?: number;
  language?: ISOLanguage;
  availableVersions?: number[];
  availableLanguages?: ISOLanguage[];
};

type QuestionnaireSelectionProps = {
  handleChange: React.Dispatch<React.SetStateAction<QuestionnaireSelection>>;
  allQuestionnaires: QuestionnaireBaseData[];
  selectedValue: QuestionnaireSelection;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontWeight: "bold",
      paddingLeft: 14,
      paddingTop: 2,
      textTransform: "uppercase",
    },
    root: {
      background: "rgba(237, 242, 247, 0.7)",
      height: "100%",
      border: "1.5px solid #CBD5E0",
      boxSizing: "border-box",
      borderRadius: 6,
    },
    listItemText: {
      fontSize: "0.9rem",
      lineHeight: "1.25rem",
    },
  })
);

export const QuestionnaireSelectionDrawer: React.FC<QuestionnaireSelectionProps> = ({
  handleChange,
  allQuestionnaires,
  selectedValue,
}) => {
  const classes = useStyles();
  const [orderedLatestQuestionnaires, setOrderedLatestQuestionnaires] = useState<QuestionnaireBaseData[]>([]);

  useEffect(() => {
    const groupedObj: { [id: string]: QuestionnaireBaseData[] } = {};
    for (let questionnaire of allQuestionnaires) {
      groupedObj[questionnaire.id] = groupedObj[questionnaire.id] || [];
      groupedObj[questionnaire.id].push(questionnaire);
    }
    const latestQuestionnaires = Object.keys(groupedObj).map((id) => getLatestVersion(groupedObj[id]));
    const result = latestQuestionnaires.sort((a, b) => a.title.localeCompare(b.title));
    setOrderedLatestQuestionnaires(result);
  }, [allQuestionnaires]);

  const handleOnClick = (questionnaireData: QuestionnaireBaseData) => {
    const browserLanguage = navigator.language.split("-")[0] as ISOLanguage;
    const versions = getVersions(questionnaireData.id);
    const selection: QuestionnaireSelection = {
      id: questionnaireData.id,
      version: questionnaireData.version,
      availableVersions: versions,
      availableLanguages: questionnaireData.meta.availableLanguages,
    };
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

  const getLatestVersion = (list: QuestionnaireBaseData[]): QuestionnaireBaseData => {
    const versions = list.map((it) => it.version);
    const latest = Math.max(...versions);
    const filtered = list.filter((it) => it.version === latest);
    return filtered[0];
  };

  const getVersions = (id: string): number[] => {
    const questionnaires = allQuestionnaires.filter((it) => it.id === id);
    const versions = questionnaires.map((it) => it.version);
    return versions.sort();
  };

  if (orderedLatestQuestionnaires.length === 0) {
    return <div className={classes.root}>No questionnaires available</div>;
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>Questionnaires</Typography>
      <List>
        {orderedLatestQuestionnaires.map((it) => {
          return (
            <ListItem onClick={() => handleOnClick(it)} selected={selectedValue.id === it.id} button key={it.path}>
              <ListItemText classes={{ primary: classes.listItemText }} primary={it.title} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
