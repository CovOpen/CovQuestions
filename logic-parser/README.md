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

Also, there is an inline `If`

The operator precedence follow JavaScript or C++ precedence.

## Examples

```
If 3 + 2 Then
    "True"
Else
    If 8 > 4 + 2 Then
        "Totally not True"
    Else
        8 in [1, 2, 3, 4]
    EndIf
EndIf
```

```
5 < 2 AND (0 * 8 > 2 + 7 OR 1 < 2)
```

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
