import { GDLLexer } from './lexer/lexer';

export function parseGDL(source) {
  const lexer = new GDLLexer(source);
  const tokens = [];
  let token;
  
  while ((token = lexer.nextToken()).type !== 'EOF') {
    tokens.push(token);
  }
  
  return tokens;
}

export default {
  parseGDL
};