# User instructions for the CovQuestions editor

## Result Categories

There can be multiple result categories. Each of them is evaluated independently from the others. Each result category
should be associated with at least one result. After finishing the questionnaire each result category is evaluated and
the first matching result is returned (the order or results inside one category matter).

### Inline variables

The texts of results can display inline variables. The library [printf](https://www.npmjs.com/package/printf) is used
for the parsing. We use the "Argument mapping" syntax described in the library documentation.

- `Text with a float number %(var_number).2f in the middle with two decimals.`
- `Text with an integer %(var_number)d in the middle.`
- `Text with another string %(var_text)s in the middle.`

## Test Cases

There are two main options for test cases: randomness and strictness.

### Randomness

If the field `randomRuns` is empty or set to 0, questions are not answered randomly. Optional questions may be omitted,
but if a mandatory question is not given, the test case will fail.

If `randomRuns >= 1`, all questions for which answers are not provided are randomly answered.

### Strictness

If `strictResults` is true, all results of the test run have to be set in the expectation. If it is false, only the
expected result categories are checked for correctness. Additional result categories may also have results.

## CovScript

CovScript is the "language" in which logical expressions are written. They can be used, e.g., to enable or disable
questions, to assign values to variables, or to evaluate the result of the questionnaire. CovScript is converted to
JsonLogic, which is enhanced with extra variables and operators.

### Primitive data types

- Strings `"Hello world"`, `"True", "42"`
- Numbers `42`
- Booleans `True`

### Arithmetic expressions

- `1 + 1`
- `2 - 1`
- `(1 + 3) * 2`

### Comparisons

- `3 < 2`
- `5 <= 5`

### Conditions

- `If test_variable == 42 Then 2 Else 4 EndIf`

### Variables

- Variables are written without quotes, e.g, `q_question`.
- Available variables:
  - The current date as Unix timestamp in seconds since January 1st 1970: `now`
  - Answers to numeric, boolean, text or date questions as the question id: `question_id`
  - Answers to multiselect and select questions in the format
    - `question_id.count` returns the number of options
    - `question_id.selected_count`
    - `question_id.unselected_count`
    - `question_id.option.option_id` returns the value of the option
    - `question_id.score.score_id` returns the sum over the specific score_id over all selected options for the
      current question
  - Scores, calculated as the sum over all selected options from all multiselect and select questions
    - `scores.score_id`

### Date conversion

As an additional operation `convert_to_date_string` has been introduced to convert UNIX timestamps to formatted dates.
The library [dayjs](https://www.npmjs.com/package/dayjs) is used for this conversion. Possible formats can be
seen [here](https://day.js.org/docs/en/parse/string-format).

- `q_contact_date convert_to_date_string "YYYY.MM.DD"`, where `q_contact_date` is the id of a date question
