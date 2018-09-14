import {describe, it} from 'mocha';
import assert from 'power-assert';
import {parseScript} from 'esprima';

describe('index.js', function() {
  describe('esprima', function() {
    it('parseScript', function() {
      const source = 'const foo = 1 + 2;';
      const ast = parseScript(source); 
      assert.deepEqual(ast, {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: {
                    type: 'Literal',
                    value: 1,
                    raw: '1'
                  },
                  right: {
                    type: 'Literal',
                    value: 2,
                    raw: '2'
                  }
                }
              }
            ],
            kind: 'const'
          }
        ],
        sourceType: 'script'
      });
    });
  });
});