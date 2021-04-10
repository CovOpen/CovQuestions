import React, { useEffect, useState } from "react";
import { createStyles, List, ListItem, ListItemText, makeStyles, Theme, Typography } from "@material-ui/core";
import { ISOLanguage } from "@covopen/covquestions-js";
import { QuestionnaireBaseData } from "../../models/QuestionnairesList";
import { EditorQuestionnaire } from "../../models/editorQuestionnaire";
import { QuestionnaireIdentification } from "../../utils/queryParams";

type QuestionnaireSelectionProps = {
  handleChange: (selection: QuestionnaireIdentification) => void;
  allQuestionnaires: QuestionnaireBaseData[];
  selectedValue: EditorQuestionnaire;
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
    const availableLanguages = questionnaireData.meta.availableLanguages;
    // Default to browser language
    let language = navigator.language.split("-")[0] as ISOLanguage;

    if (availableLanguages.indexOf("en") > -1) {
      language = "en";
    } else {
      language = availableLanguages[0];
    }

    handleChange({
      id: questionnaireData.id,
      language: language as ISOLanguage,
      version: questionnaireData.version,
    });
  };

  const getLatestVersion = (list: QuestionnaireBaseData[]): QuestionnaireBaseData => {
    const versions = list.map((it) => it.version);
    const latest = Math.max(...versions);
    const filtered = list.filter((it) => it.version === latest);
    return filtered[0];
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
