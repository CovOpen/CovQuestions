import React from "react";
import { QuestionWithValues } from "../App";

export const RadioSelect: React.FC<{
  currentQuestion: QuestionWithValues;
  onChange: React.Dispatch<React.SetStateAction<{}>>;
}> = ({ currentQuestion, onChange }) => {
  const handleChange = (e: any) => {
    const currentTargetValue = e.currentTarget.value;
    onChange(currentTargetValue);
  };

  return (
    <>
      <div>{currentQuestion.question}</div>
      <div>
        {currentQuestion.possibleAnswers.map((answer) => (
          <>
            <input
              value={answer.value}
              name={currentQuestion.id}
              type="radio"
              onChange={handleChange}
            />
            <label htmlFor={answer.value}>{answer.label}</label>
          </>
        ))}
      </div>
    </>
  );
};
