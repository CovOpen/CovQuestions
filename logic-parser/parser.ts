import { createToken, Lexer, CstParser, CstNode, CstElement, IToken } from 'chevrotain'
import { inspect } from 'util'
import * as L from 'covquestions-js/models/logicExpression'

const Keyword = createToken({ name: 'Keyword', pattern: Lexer.NA })
// Groups are used for precedence - from here most important to least important.
const UnaryOperator = createToken({ name: 'UnaryOperator', pattern: Lexer.NA })
const AdditionOperator = createToken({ name: 'AdditionOperator', pattern: Lexer.NA })
const MultiplicationOperator = createToken({ name: 'MultiplicationOperator', pattern: Lexer.NA })
const ComparisonOperator = createToken({ name: 'ComparisonOperator', pattern: Lexer.NA })

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  // Any form of whitespace, length at least 1.
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
})

const StringLiteral = createToken({
  name: 'StringLiteral',
  // A string literal, taking care of \" inside the string.
  pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
})

const NumberLiteral = createToken({
  name: 'NumberLiteral',
  // All kinds of number, integer or decimal, negative or positive, exponential notation supported.
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
})

const Identifier = createToken({
  name: 'Identifier',
  // Alphanumeric, can not start with number, length at least 1.
  // Can contain dots, per convention
  pattern: /[a-zA-Z_][\w\.]*/,
})

const True = createToken({ name: 'True', pattern: /true|True|FALSE/ })
const False = createToken({ name: 'False', pattern: /false|False|FALSE/ })
const Null = createToken({ name: 'Null', pattern: /null|Null|NULL/ })

const LSquare = createToken({ name: 'LSquare', pattern: /\[/ })
const RSquare = createToken({ name: 'RSquare', pattern: /\]/ })

const LRound = createToken({ name: 'LRound', pattern: /\(/ })
const RRound = createToken({ name: 'RRound', pattern: /\)/ })

const If = createToken({ name: 'If', pattern: /if|IF|If/, categories: Keyword })
const Then = createToken({ name: 'Then', pattern: /then|THEN|Then/, categories: Keyword })
const Else = createToken({ name: 'Else', pattern: /else|ELSE|Else/, categories: Keyword })
const EndIf = createToken({ name: 'EndIf', pattern: /endif|ENDIF|EndIf/, categories: Keyword })

const Comma = createToken({ name: 'Comma', pattern: /,/ })
const Add = createToken({ name: 'Add', pattern: /\+/, categories: AdditionOperator })
const Sub = createToken({ name: 'Sub', pattern: /-/, categories: AdditionOperator })

const Mult = createToken({ name: 'Mult', pattern: /\*/, categories: MultiplicationOperator })
const Div = createToken({ name: 'Div', pattern: /\/|\÷/, categories: MultiplicationOperator })
const Mod = createToken({ name: 'Mod', pattern: /%/, categories: MultiplicationOperator })

const InOperator = createToken({ name: 'In', pattern: /IN|in|In/, categories: UnaryOperator })

const Greater = createToken({ name: 'Greater', pattern: />/, categories: ComparisonOperator })
const Less = createToken({ name: 'Less', pattern: /</, categories: ComparisonOperator })
const GreaterEqual = createToken({ name: 'GreaterEqual', pattern: />=/, categories: ComparisonOperator })
const LessEqual = createToken({ name: 'LessEqual', pattern: /<=/, categories: ComparisonOperator })
const Equal = createToken({ name: 'GreaterEqual', pattern: /==/, categories: ComparisonOperator })
const NotEqual = createToken({ name: 'LessEqual', pattern: /!=/, categories: ComparisonOperator })
const Negation = createToken({ name: 'Negation', pattern: /!/, categories: UnaryOperator })

const AndOperator = createToken({ name: 'And', pattern: /and|AND|And/ })
const OrOperator = createToken({ name: 'Or', pattern: /or|OR|Or/ })

const allTokens = [
  WhiteSpace,

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

  NumberLiteral,
  StringLiteral,
  Identifier
]

const CovscriptLexer = new Lexer(allTokens)

/**
 * Cst parser
 * 
 * We need to trick a little bit to get recursive expressions
 * with operator precedence to work.
 * 
 * This parser uses C++ Operator Precedence, IN counts as unary operator: 
 * https://en.cppreference.com/w/cpp/language/operator_precedence
 * 
 * Here is an example with explainations about how to get recursive expressions
 * to work with a Cst parser:
 * https://github.com/SAP/chevrotain/blob/master/examples/grammars/calculator/calculator_pure_grammar.js
 * 
 * TL/DR instead of having a big OR for all expressions, we build a chain with rhs/lhs according to priority.
 * This leads to a large parse tree.
 */

class CovScriptParser extends CstParser {
  constructor() {
    super(allTokens)
    this.performSelfAnalysis()
  }

  private array = this.RULE('array', () => {
    this.CONSUME(LSquare)
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.SUBRULE(this.value)
      },
    })
    this.CONSUME(RSquare)
  })

  public value = this.RULE('valueInner', () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      { ALT: () => this.CONSUME(Null) },
      { ALT: () => this.SUBRULE(this.array) },
    ])
  })

  private unaryOperation = this.RULE("unaryOperation", () => {
    this.CONSUME(UnaryOperator, { LABEL: "operator" })
    this.SUBRULE(this.atomicExpression, { LABEL: "expression" })
  })

  public condition = this.RULE('condition', () => {
    this.CONSUME(If)
    this.SUBRULE(this.expression, { LABEL: 'contition' })
    this.CONSUME(Then)
    this.SUBRULE2(this.expression, { LABEL: 'brachTrue' })
    this.CONSUME(Else)
    this.SUBRULE3(this.expression, { LABEL: 'branchFalse' })
    this.CONSUME(EndIf)
  })

  // This is our actual parser chain, which
  // is designed to avoid endless left-hand recursion and
  // also takes care of operator precedence.
  public expression = this.RULE('expression', () => {
    this.SUBRULE(this.logicOrExpression)
  })

  private logicOrExpression = this.RULE("logicOrExpression", () => {
    this.SUBRULE(this.logicAndExpression, { LABEL: "lhs" })
    this.MANY(() => {
      this.CONSUME(OrOperator, { LABEL: "operator" })
      this.SUBRULE2(this.logicAndExpression, { LABEL: "rhs" })
    })
  })

  private logicAndExpression = this.RULE("logicAndExpression", () => {
    this.SUBRULE(this.comparisonExpression, { LABEL: "lhs" })
    this.MANY(() => {
      this.CONSUME1(AndOperator, { LABEL: "operator" })
      this.SUBRULE2(this.comparisonExpression, { LABEL: "rhs" })
    })
  })

  private comparisonExpression = this.RULE("comparisonExpression", () => {
    this.SUBRULE(this.additionExpression, { LABEL: "lhs" })
    this.MANY(() => {
      this.CONSUME(ComparisonOperator, { LABEL: "operator" })
      this.SUBRULE2(this.additionExpression, { LABEL: "rhs" })
    })
  })

  private additionExpression = this.RULE("additionExpression", () => {
    this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" })
    this.MANY(() => {
      this.CONSUME(AdditionOperator, { LABEL: "operator" })
      this.SUBRULE2(this.multiplicationExpression, { LABEL: "rhs" })
    })
  })

  private multiplicationExpression = this.RULE("multiplicationExpression", () => {
    this.SUBRULE(this.atomicExpression, { LABEL: "lhs" })
    this.MANY(() => {
      this.CONSUME(MultiplicationOperator, { LABEL: "operator" })
      this.SUBRULE2(this.atomicExpression, { LABEL: "rhs" })
    })
  })

  // "Atomic" Expression. Avoids endless recursion.
  // This rule allows to break out from a precedence-based chain
  // by using parantheses, an if, or a unary operation
  public atomicExpression = this.RULE('atomicExpression', () => {
    this.OR([
      { ALT: () => {
        this.CONSUME(LRound)
        this.SUBRULE(this.expression, { LABEL: "expression" })
        this.CONSUME(RRound)
      }},
      { ALT: () => {
        this.SUBRULE(this.unaryOperation, { LABEL: "expression" })
      }},
      { ALT: () => {
        this.SUBRULE(this.condition, { LABEL: "expression" })
      }},
      { ALT: () => {
        this.SUBRULE(this.value, { LABEL: "expression" })
      }},
    ])
  })

}

const parser = new CovScriptParser()

export function parseCovscript(text: string) {
  const lexResult = CovscriptLexer.tokenize(text)

  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens
  // any top level rule may be used as an entry point
  const cst = parser.expression()

  // this would be a TypeScript compilation error because our parser now has a clear API.
  // let value = parser.json_OopsTypo()

  return {
    // This is a pure grammar, the value will be undefined until we add embedded actions
    // or enable automatic CST creation.
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors
  }
}


function tokenToLogic(token: IToken): L.LogicExpression {
  switch(token.tokenType) {
    case NumberLiteral: return parseFloat(token.image)
    case StringLiteral: return token.image
    case Identifier: return { var: token.image }
    default: throw new Error(`Unknown token type: ${token.tokenType.name}`)
  }
}

/**
 * Safely gets the single child from a dummy node.
 */
function unwrap(cst: CstNode): L.LogicExpression {
  const key = Object.keys(cst.children)
  const children = cst.children[key[0]]
  if(key.length > 1 || children.length > 1) {
    throw new Error('CST node had more than one children. This is an internal error.')
  }

  const child = children[0]

  if(child["name"] !== undefined) {
    return toLogic(child as CstNode)
  } else {
    return tokenToLogic(child as IToken)
  }
}

type BinaryOperator = 'or' | 'and' | '-' | '+' | '*' | '/' | '==' | '>=' | '<=' | '!=' | '<' | '>'
type UnaryOperator = '!' | 'in'

function packList([head, ...tail]: CstNode[], [opHead, ...opTail]: IToken[]): L.LogicExpression {
  const expr = { } as L.LogicExpression

  const childs = tail.length > 1 ? packList(tail, opTail) : toLogic(tail[0])
  const op = opHead.image as BinaryOperator

  expr[op]= [
    toLogic(head),
    childs
  ]

  return expr
}

function binaryToLogic(cst: CstNode): L.LogicExpression  {
  const lhs = cst.children['lhs'] as CstNode[]
  const rhs = cst.children['rhs'] as CstNode[]

  if(lhs.length !== 1) {
    throw new Error('Left hand side of binary expression needs to have length one.')
  }

  if(rhs === undefined || rhs.length === 0) {
    // This was just a dummy node.
    return unwrap(cst)
  } else {
    const operator = cst.children['operator'] as IToken[]

    if(operator === undefined) {
      throw new Error('Operator for binary expression was undefined.')
    }

    if(operator.length !== rhs.length + lhs.length - 1) {
      throw new Error('Incorrect count of operators for binary expression list.')
    }

    return packList([...lhs, ...rhs], operator)
  }
}

function unaryToLogic(cst: CstNode): L.LogicExpression {
  const expression = cst.children['expression'] as CstNode[]
  const operator = cst.children['operator'] as IToken[]

  if(!expression && expression.length !== 1) {
    throw new Error('Expected exactly one expression')
  }

  if(!operator && operator.length !== 1) {
    throw new Error('Expected exactly one operator')
  }

  const op = operator[0].image as UnaryOperator
  const expr = { } as L.LogicExpression

  expr[op] = toLogic(expression[0])

  return expr
}

function atomicToLogic(cst: CstNode): L.LogicExpression {
  const expr = cst.children['expression'] as CstNode[]

  if(!expr && expr.length !== 1) {
    throw new Error('Expected exactly one expression')
  }

  return toLogic(expr[0])
}

export function toLogic(cst: CstNode): L.LogicExpression {
  
  switch(cst.name) {
    case 'expression': return unwrap(cst)
    case 'valueInner': return unwrap(cst)
    case 'logicOrExpression': return binaryToLogic(cst)
    case 'logicAndExpression': return binaryToLogic(cst)
    case 'additionExpression': return binaryToLogic(cst)
    case 'multiplicationExpression': return binaryToLogic(cst)
    case 'comparisonExpression': return binaryToLogic(cst)
    case 'atomicExpression': return atomicToLogic(cst)
    case 'unaryOperation': return unaryToLogic(cst)
    default: throw new Error(`Unknown node type: ${cst.name}`)
  }
}

// const res = parseCovscript(`IF (question1.value > 5) THEN (question1.value + 100) ELSE 100 ENDIF`)
const res = parseCovscript(`3 + 5 * (8 - 2)`)
const logic = toLogic(res.cst)

console.log(inspect(logic, { depth: null }))