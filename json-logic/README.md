# CovQuestions Draft

This is the draft of a custom questionaire format for the CovQuestions project.

## Requirements

* Relatively easy to edit
* Easy to use and implement
* As platform-independend as possible
* Describe questions, results, and result-computation logic
* Questions might be shown or not depending in intermediate results
* Support for multiple result categories, with their own results and computations

## Considerations

### Result Format

Two possible options: 
1. "Flat" list of results with a expressione evaluating to a boolean
2. Result categories with an expression that evaluate to a result id with a list of results per category.

We favor option 2 - with option 1 it is easy to accidentially show two results from the same category. This is impossible with 2 by design at the price of one additional layer of nesting.

### Evaluation

Two possible options: 
1. Put all variables and questions into the same array and process them in order.
2. Seperate variables and questions, process all questions in order and (re-)evaluate all variables after each update.

We favor option 2 - it gives the user one less thing to worry about.

#### Structuring Expressions

JSON Logic is powerful, but messy to read/write. There are multiple ways to express the same logic.
Once we have a better understanding of the task at hand, we should come up with some basic guidelines for
formatting and structuring.

### Dependencies between variables

We favor a relatively simple logic and no automatic dependency resolution/re-ordering of questions or variables. 
If things are ordered incorrectly (e.g. the skipIf in a question refers a future question), the questionaire author should discover and repair the issue during testing.

### Answer Representation

For each answered question, we multiple JSON-Logic variables prefixed with the question id:

```
question_id.value // string, array of string, number, boolean, date, depending on type
question_id.count // number
question_id.answered // boolean
```

### Special Variables

We need to introduce a set of special meta variables:
* the date when the survey was conducted
* tbd.

### Working with dates

This is a nasty TODO. 
A simplified representation would be better for integrating with JSON-Logic, for example using the amount of Days since 1.1.1970 or otherwise unix timestamps.