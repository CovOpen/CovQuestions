import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

type QuestionnaireSelectionProps = {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  allQuestionnaires: any[];
};

export const QuestionnaireSelectionDropdown: React.FC<QuestionnaireSelectionProps> = ({
  handleChange,
  allQuestionnaires,
}) => {
  const onChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value;
    if (typeof value === "string") {
      handleChange(value);
    }
  };

  return (
    <FormControl>
      <InputLabel id="questionnaire-select-label">Which questionnaire</InputLabel>
      <Select labelId="questionnaire-select-label" id="questionnaire-select" onChange={onChange} defaultValue="">
        {allQuestionnaires.map((it) => (
          <MenuItem key={it.path} value={it.path}>
            {it.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
