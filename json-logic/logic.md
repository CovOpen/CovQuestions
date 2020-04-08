# Mapping generic logic to JSON-Logic

This files summarizes how logic operations can be mapped to JSON-Logic.

## Programm Control
- `IF <condition> THEN <expression1> ELSE <expression2>`: `{"if": [<condition>, <expression1>, <expression2>]}`

## Logical operations
- `<questionId> == <value>`: `{"==", [{"var": <questionId>.value}, <value>]}`
- `<questionId1> == <questionId2>`: `{"==", [{"var": <questionId1>.value}, {"var": <questionId2>.value}]}`
- `<condition1> OR <condition2>`: `{"and": [<condition1>, <condition2>]}`
- `x < <value> < y`: `{"<", [x, y, <value>]}`

## Numerical Operations
- +, -, *, /, modulo

## Array Operations
- `map`, `filter`
- aggregations: `reduce`, `some`, `all`, `merge`, `missing`
- `variable = array[<index>]`: `{"var": array[<index>]}`

## String operations
- `cat` (concatenate strings), `substr`, `in`
