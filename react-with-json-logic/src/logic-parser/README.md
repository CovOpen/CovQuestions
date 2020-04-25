# Logic Parser

## Supported

- `IF (<condition>) THEN (<value-then>) ELSE (<value-else>)`
- accessing data: `<dot-notation-to-value>:<default-value>`. Make sure that
  there is at least one dot in it.
- all logic operators, except for `!!`. And no space is allowed between `!` and
  the following expression
- numeric operators, airthmetric operators, logical and, logical or, modulo
- `in` operator
- shortcuts for `+`, `*` (syntax `+|* [<value-1>,<value-2>, ...]`)
- `max` and `min` (syntax: `max [<value-1>,<value-2>, ...]`)
- range operator (syntax: `<min-val> <|<=|>|>= <value> <|<=|>|>= <max-val>`)

## TODO

- **No rules for precedences!**: Make sure to use parantheses everywhere.
  Otherwise the expressions are evaluated in the order of occurence. E.g.
  `4 + 3 * 2` would result in 14 instead of 10 and `10 < 4 + 3` would result in
  3 (== `true`) instead of `false`.
- implement `substr`, `cat`, `map`, `filter` and `reduce`

## Testing

1. Run `npm install`
2. Run `tsc parser.test.ts && node parser.test.js` in `logic-parser`
