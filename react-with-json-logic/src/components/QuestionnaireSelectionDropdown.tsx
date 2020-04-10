import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

export const QuestionnaireSelectionDropdown: React.FC<{
  handleChange: any;
  allQuestionnaires: any[];
}> = ({ handleChange, allQuestionnaires }) => {
  return (
    <FormControl>
      <InputLabel id="questionnaire-select-label">
        Which questionnaire
      </InputLabel>
      <Select
        labelId="questionnaire-select-label"
        id="questionnaire-select"
        onChange={handleChange}
        defaultValue=""
      >
        {allQuestionnaires.map((it) => (
          <MenuItem key={it.path} value={it.path}>
            {it.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
