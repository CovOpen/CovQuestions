import { expectGen, expectE2E } from './common'

describe('Covscript generator basic tests', () => {
  expectGen({ '+': [1, 2] }, '1 + 2')
  expectGen({ '-': [1, 2] }, '1 - 2')
  expectGen({ '*': [1, 2] }, '1 * 2')
  expectGen({ '*': [1, { '+': [2, 3] }] }, '1 * (2 + 3)')
  expectGen({ 'if': [1, 2, 3] }, 'If 1 Then 2 Else 3 EndIf')
  expectGen({ 'var': 'testQuestion.value' }, 'testQuestion.value')
  expectGen([1, 2, 3, 4, 5, 6], '[1, 2, 3, 4, 5, 6]')
  expectGen(true, 'true')
  expectGen(false, 'false')
  expectGen("Hello", '"Hello"')
})

// Those tests utilize the parser to create an end-to-end situation!
describe('Covscript generator complex tests', () => {
  expectE2E('5 < 2 AND (0 * 8 > 2 + 7 OR 1 < 2)', '5 < 2 and (0 * 8 > 2 + 7 or 1 < 2)')
  expectE2E('IF 1 == 3 AND 1 != 3 THEN 2 + 5 ELSE 21 + 9 ENDIF', 'If 1 == 3 and 1 != 3 Then 2 + 5 Else 21 + 9 EndIf')
})