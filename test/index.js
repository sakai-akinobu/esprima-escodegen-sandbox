import {describe, it} from 'mocha';
import assert from 'power-assert';
import {parseScript} from 'esprima';
import {generate} from 'escodegen';
import {traverse} from 'estraverse';
import * as types from 'ast-types';

describe('index.js', function() {
  describe('parse <=> generate', function() {
    const source = 'const foo = 1 + 2;';
    const ast = {
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
    };

    describe('parse', function() {
      it('parseScript', function() {
        const parsedAst = parseScript(source);
        assert.deepEqual(parsedAst, ast);
      });
    });

    describe('generate', function() {
      it('generate', function() {
        const generatedSource = generate(ast);
        assert.strictEqual(generatedSource, source);
      });
    });
  });

  describe('transform', function() {
    it('transform variable name', function() {
      const source = 'const foo = 1;';
      const ast = parseScript(source);
      traverse(ast, {
        enter: node => {
          if (node.type === 'VariableDeclarator') {
            node.id = types.builders.identifier('bar');
          }
        },
      });
      const generatedSource = generate(ast);
      assert.strictEqual(generatedSource, 'const bar = 1;');
    });

    it('transform function name', function() {
      const source = 'function foo() { return 1; }';
      const ast = parseScript(source);
      traverse(ast, {
        enter: node => {
          if (node.type === 'FunctionDeclaration') {
            node.id = types.builders.identifier('bar');
          }
        },
      });
      const generatedSource = generate(ast);
      assert.strictEqual(generatedSource,
        [
          'function bar() {',
          '    return 1;',
          '}'
        ].join('\n')
      );
    });
  });

});