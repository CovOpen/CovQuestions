import { IToken, CstNode } from "chevrotain"
import * as T from './tokens'
import * as L from 'covquestions-js/models/logicExpression'

type BinaryOperator = 'or' | 'and' | '-' | '+' | '*' | '/' | '==' | '>=' | '<=' | '!=' | '<' | '>'
type UnaryOperator = '!' | 'in'

export class ToJsonLogicTransformer {

  /**
   * Converts a leaf node to JSON-Logic. 
   * @param token The token to convert.
   */
  private tokenToLogic(token: IToken): L.LogicExpression {
    switch(token.tokenType) {
      case T.NumberLiteral: return parseFloat(token.image)
      // Trim Quotes and Unsecape literals.
      case T.StringLiteral: return JSON.parse(token.image)
      case T.True: return true
      case T.False: return false
      case T.Null: return null
      case T.Identifier: return { var: token.image }
      default: throw new Error(`Unknown token type: ${token.tokenType.name}`)
    }
  }

  /**
   * Safely gets the single child from a dummy node.
   */
  private unwrap(cst: CstNode): L.LogicExpression {
    const key = Object.keys(cst.children)
    const children = cst.children[key[0]]
    if(key.length > 1 || children.length > 1) {
      throw new Error('CST node had more than one children. This is an internal error.')
    }

    const child = children[0]

    if(child["name"] !== undefined) {
      return this.toLogic(child as CstNode)
    } else {
      return this.tokenToLogic(child as IToken)
    }
  }
 
  /**
   * Recursively packas a list of binary operations into a non-flat JSON-logic structure.
   * @param param0 The child expressions.
   * @param param1 The operators between expressions.
   */
  private packList([head, ...tail]: CstNode[], [opHead, ...opTail]: IToken[]): L.LogicExpression {
    const expr = { } as L.LogicExpression

    const childs = tail.length > 1 ? this.packList(tail, opTail) : this.toLogic(tail[0])
    const op = opHead.image as BinaryOperator

    expr[op]= [
      this.toLogic(head),
      childs
    ]

    return expr
  }

  /**
   * Recursively converts a binary expression to JSON-logic
   * @param cst The expression node.
   */
  private binaryToLogic(cst: CstNode): L.LogicExpression  {
    const lhs = cst.children['lhs'] as CstNode[]
    const rhs = cst.children['rhs'] as CstNode[]

    if(lhs.length !== 1) {
      throw new Error('Left hand side of binary expression needs to have length one.')
    }

    if(rhs === undefined || rhs.length === 0) {
      // This was just a dummy node.
      return this.unwrap(cst)
    } else {
      const operator = cst.children['operator'] as IToken[]

      if(operator === undefined) {
        throw new Error('Operator for binary expression was undefined.')
      }

      if(operator.length !== rhs.length + lhs.length - 1) {
        throw new Error('Incorrect count of operators for binary expression list.')
      }

      return this.packList([...lhs, ...rhs], operator)
    }
  }

  /**
   * Recursively converts a unary expression to JSON logic.
   * @param cst The expression node.
   */
  private unaryToLogic(cst: CstNode): L.LogicExpression {
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

    expr[op] = this.toLogic(expression[0])

    return expr
  }

  /**
   * Recursively converts an atomic expression to JSON-logic.
   * This happens by unwrapping.
   * @param cst The expression node.
   */
  private atomicToLogic(cst: CstNode): L.LogicExpression {
    const expr = cst.children['expression'] as CstNode[]

    if(!expr && expr.length !== 1) {
      throw new Error('Expected exactly one expression')
    }

    return this.toLogic(expr[0])
  }

  /**
   * Main Entrypoint.
   * Converts an expression to JSON-logic.
   */
  public toLogic(cst: CstNode): L.LogicExpression {
    
    switch(cst.name) {
      case 'expression': return this.unwrap(cst)
      case 'valueInner': return this.unwrap(cst)
      case 'logicOrExpression': return this.binaryToLogic(cst)
      case 'logicAndExpression': return this.binaryToLogic(cst)
      case 'additionExpression': return this.binaryToLogic(cst)
      case 'multiplicationExpression': return this.binaryToLogic(cst)
      case 'comparisonExpression': return this.binaryToLogic(cst)
      case 'atomicExpression': return this.atomicToLogic(cst)
      case 'unaryOperation': return this.unaryToLogic(cst)
      default: throw new Error(`Unknown node type: ${cst.name}`)
    }
  }

}