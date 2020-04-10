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

For each answered question, we expose multiple JSON-Logic variables prefixed with the question id:

```
question_id.answered // Indicates if question was answered  (true) or skipped (false), boolean.
question_id.value // Value of the answer, string, number, boolean, depending on type
```

For making multi-select questions easier to evaluate, we additionally expose the following properties.

```
question_id.value // Array of string, 
question_id.selectedCount // Count of selected options
question_id.count // Count of all (selected/unselected) options
question_id.unselectedCount // Count of not-selected options
question_id.option.option_id.selected // True or false, indicating if option_id was selected
```

For date-specific questions, `value` is the date difference to the current date in days. Current date always refers to the moment when the questionaire was conducted. 
If the answers and results are to be saved, it needs to be stored with the given answers to allow reproducible results.

### Internationalization

Instead of using human readable text inside the questionaire file, we allow providing a resource file in JSON format:

```
{
    "question_id.text": "Text of the question",
    "question_id.option_id.text": Text of the option",
    "name": "Name of the questionaire",
    "etc": "etc"
}
```
