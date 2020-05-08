import { createToken, Lexer } from "chevrotain";

export const Keyword = createToken({ name: "Keyword", pattern: Lexer.NA });

export const UnaryOperator = createToken({
  name: "UnaryOperator",
  pattern: Lexer.NA,
});
export const AdditionOperator = createToken({
  name: "AdditionOperator",
  pattern: Lexer.NA,
});
export const MultiplicationOperator = createToken({
  name: "MultiplicationOperator",
  pattern: Lexer.NA,
});
export const ComparisonOperator = createToken({
  name: "ComparisonOperator",
  pattern: Lexer.NA,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  // Any form of whitespace, length at least 1.
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

export const StringLiteral = createToken({
  name: "StringLiteral",
  // A string literal, taking care of \" inside the string.
  pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  // All kinds of number, integer or decimal, negative or positive, exponential notation supported.
  pattern: /(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});

export const Identifier = createToken({
  name: "Identifier",
  // Alphanumeric, can not start with number, length at least 1.
  // Can contain dots, per convention
  pattern: /[a-zA-Z_][\w\.]*/,
});

export const True = createToken({ name: "True", pattern: /true|True|TRUE/ });
export const False = createToken({
  name: "False",
  pattern: /false|False|FALSE/,
});
export const Null = createToken({ name: "Null", pattern: /null|Null|NULL/ });

export const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
export const RSquare = createToken({ name: "RSquare", pattern: /\]/ });

export const LRound = createToken({ name: "LRound", pattern: /\(/ });
export const RRound = createToken({ name: "RRound", pattern: /\)/ });

export const If = createToken({
  name: "If",
  pattern: /if|IF|If/,
  categories: Keyword,
});
export const Then = createToken({
  name: "Then",
  pattern: /then|THEN|Then/,
  categories: Keyword,
});
export const Else = createToken({
  name: "Else",
  pattern: /else|ELSE|Else/,
  categories: Keyword,
});
export const EndIf = createToken({
  name: "EndIf",
  pattern: /endif|ENDIF|EndIf/,
  categories: Keyword,
});

export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Add = createToken({
  name: "Add",
  pattern: /\+/,
  categories: [UnaryOperator, AdditionOperator],
});
export const Sub = createToken({
  name: "Sub",
  pattern: /-/,
  categories: [UnaryOperator, AdditionOperator],
});

export const Mult = createToken({
  name: "Mult",
  pattern: /\*/,
  categories: MultiplicationOperator,
});
export const Div = createToken({
  name: "Div",
  pattern: /\/|\÷/,
  categories: MultiplicationOperator,
});
export const Mod = createToken({
  name: "Mod",
  pattern: /%/,
  categories: MultiplicationOperator,
});

export const InOperator = createToken({
  name: "In",
  pattern: /IN|in|In/,
  categories: ComparisonOperator,
});

export const Greater = createToken({
  name: "Greater",
  pattern: />/,
  categories: ComparisonOperator,
});
export const Less = createToken({
  name: "Less",
  pattern: /</,
  categories: ComparisonOperator,
});
export const GreaterEqual = createToken({
  name: "GreaterEqual",
  pattern: />=/,
  categories: ComparisonOperator,
});
export const LessEqual = createToken({
  name: "LessEqual",
  pattern: /<=/,
  categories: ComparisonOperator,
});
export const Equal = createToken({
  name: "Equal",
  pattern: /==/,
  categories: ComparisonOperator,
});
export const NotEqual = createToken({
  name: "NotEqual",
  pattern: /!=/,
  categories: ComparisonOperator,
});
export const Negation = createToken({
  name: "Negation",
  pattern: /!/,
  categories: UnaryOperator,
});

export const AndOperator = createToken({ name: "And", pattern: /and|AND|And/ });
export const OrOperator = createToken({ name: "Or", pattern: /or|OR|Or/ });

/**
 * Order is important here, the parser is greedy.
 */
export const AllTokens = [
  WhiteSpace,

  NumberLiteral,
  StringLiteral,

  True,
  False,
  Null,

  LRound,
  RRound,
  LSquare,
  RSquare,
  Comma,

  If,
  Then,
  Else,
  EndIf,

  Mult,
  Div,
  Mod,
  MultiplicationOperator,
  Add,
  Sub,
  AdditionOperator,

  InOperator,

  GreaterEqual,
  LessEqual,
  Greater,
  Less,
  Equal,
  NotEqual,
  ComparisonOperator,

  Negation,
  UnaryOperator,

  AndOperator,
  OrOperator,

  Identifier,
];
