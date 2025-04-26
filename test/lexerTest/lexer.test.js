import { GDLLexer } from '../../src/lexer/lexer';

describe('GDLLexer', () => {
  test('tokenizes simple diagram', () => {
    const lexer = new GDLLexer('diagram example {}');
    const tokens = [];
    let token;
    
    while ((token = lexer.nextToken()).type !== 'EOF') {
      tokens.push(token);
    }
    
    expect(tokens).toEqual([
      { type: 'KEYWORD_DIAGRAM', value: 'diagram', line: 1, column: 1 },
      { type: 'IDENTIFIER', value: 'example', line: 1, column: 9 },
      { type: 'BRACE_OPEN', value: '{', line: 1, column: 17 },
      { type: 'BRACE_CLOSE', value: '}', line: 1, column: 18 }
    ]);
  });
});