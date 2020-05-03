# Covscript

This repo contains a parser and a generator for Covscript, a minimal language used for formulating Covquestions questionaires.

The language is compiled to a subset of JSON-logic. JSON-logic expressions can be converted back to Covscript.

## Syntax and supported ops

A program in Covscript is always a single expression. The result of the expression is the result of the program.

The following literals are supported:

- Numeric constants (`1`, `-2`, `3.5`, `1e+3`)
- Boolean constants (`true`, `false`)
- Quote-Delimeted String constants (`"Hello"`)
- Vaiables (`question3.value`)

The following binary operations are supported:

- Arithmetic operands (`+`, `-`, `*`, `/`)
- Logical operands (`and`, `or`)
- Comparisons (`>`, `<`, `<=`, `>=`, `==`, `!=`)
- In-Operator for lists (`in`)
- Unary logical negation (`!`)

Also, there is an inline `If`, parantheses are supported.

The operator precedence follows [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table) precedence, or in other words, it does what you would expect.

## Examples

```
If work.value == "medical" Then
    "ShowMedicalAdvisory"
Else
    If has_fever.value Then
        "ShowHighRisk"
    Else
        "ShowLowRisk"
    EndIf
EndIf
```

```
If contact_date.value > symptoms_date.value Then "StayHome" Else "AlsoStayHome" EndIf
```

For more examples, please have a look at the unit tests.

## Using the Parser

```typescript
import { CovscriptToJsonLogicConverter } from "../src";

const parser = new CovscriptToJsonLogicConverter();

const res = parser.parse("1 + 2");

console.log(res); // { '+': [1, 2] }
```

## Converting back to Covscript

```typescript
import { CovscriptGenerator } from "../src/generator";

const generator = new CovscriptGenerator();

const rendered = generator.generate({ "+": [1, 2] });

console.log(res); // '1 + 2'
```
