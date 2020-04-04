import React from "react";
import { Question } from "../App";

export const DateInput: React.FC<{
  currentQuestion: Question;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    onChange(e.currentTarget.value);
  };

  return (
    <>
      <div>{currentQuestion.question}</div>
      <input
        key={currentQuestion.id}
        name={currentQuestion.id}
        onChange={handleChange}
      />
    </>
  );
};
