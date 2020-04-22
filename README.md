Quicklinks:
[Documents](https://drive.google.com/drive/folders/1YpAaD8_mvSkpHuIvbIJmsb08GLVQt8iE?usp=sharing)

# CovQuestions

A webservice where users can interactively try existing SARS-CoV-2 related
questionnaires, upload their own questionnaires and an API to provide questions
and logic for frontends

# Demo

Use the current master build as demo:
https://covquestions.z16.web.core.windows.net/

Explore the api:
https://stoplight.io/p/docs/gh/covopen/covquestions/api/v1/CovQuestions.v1.json

## Planning

Possible candidates to built on: JSON Logic http://jsonlogic.com/ JSL
https://www.npmjs.com/package/lib-jsl

Requirements:

MUST:

- Website with user interface to select a questionnaire, see questions and rules
  and try it
- API to access questionnaire

- questionnaire: - contains questions and logic - is referenced by author and
  version - versioning has a number scheme, "current" always points to newest
  questionnaire

- questions: - have an order defined by the position in the JSON file - have a
  unique id (string) - can belong to one or many categories - have a question
  type, e.g. multiple choice, date question - have an enabled/disabled state

- logic: - logic must be readable by non computer scientists (physicians), for
  example: if (conditions1 or conditions2) and conditions3 then action else
  nested if clause or action

      	- conditions:
      		- address question by unique id
      		- address group of questions by category
      			- count number of answers
      			- calculate average score
      		- supported operations: + - * / && || == !=
      	- actions:
      		- can enable/disable questions by unique id or category
      		- can write to interpretation variable (append, clear)

- [Evaluation Logic] interpretation -> Risc groups - array of strings ("Stay
  home", "please visit the local health..."]

IMPORTANT:

- multi lingual

NICE TO HAVE:

- Conversion of patient answers to space efficient bit string and vice versa
