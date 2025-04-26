export class GDLLexer {
    constructor(source) {
      this.source = source;
      this.position = 0;
      this.line = 1;
      this.column = 1;
    }
  
    peek(offset = 0) {
      return this.source[this.position + offset];
    }
  
    consume() {
      const char = this.peek();
      this.position++;
      if (char === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      return char;
    }
  
    skipWhitespace() {
      while (/\s/.test(this.peek())) {
        this.consume();
      }
    }
    nextToken() {
      this.skipWhitespace();
      
      if (this.position >= this.source.length) {
        return { type: 'EOF', value: '', line: this.line, column: this.column };
      }
  
      const char = this.peek();
  
      // Handle comments
      if (char === '/' && this.peek(1) === '/') {
        return this.handleLineComment();
      }
      if (char === '/' && this.peek(1) === '*') {
        return this.handleBlockComment();
      }
  
      // Handle strings
      if (char === '"') {
        return this.handleString();
      }
  
      // Handle numbers
      if (/\d/.test(char)) {
        return this.handleNumber();
      }
  
      // Handle identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        return this.handleIdentifier();
      }
  
      // Handle coordinates
      if (char === '(') {
        return this.handlePossibleCoordinate();
      }
  
      // Handle other punctuation
      return this.handlePunctuation();
    }
  
    handleLineComment() {
      const startLine = this.line;
      const startColumn = this.column;
      this.consume(); // /
      this.consume(); // /
      
      let value = '//';
      while (this.peek() && this.peek() !== '\n') {
        value += this.consume();
      }
      
      return {
        type: 'COMMENT',
        value,
        line: startLine,
        column: startColumn
      };
    }
  
    handleBlockComment() {
      const startLine = this.line;
      const startColumn = this.column;
      this.consume(); // /
      this.consume(); // *
      
      let value = '/*';
      while (this.peek() && !(this.peek() === '*' && this.peek(1) === '/')) {
        value += this.consume();
      }
      
      if (this.peek()) {
        value += this.consume(); // *
        value += this.consume(); // /
      }
      
      return {
        type: 'COMMENT',
        value,
        line: startLine,
        column: startColumn
      };
    }
  
    handleString() {
      const startLine = this.line;
      const startColumn = this.column;
      this.consume(); // opening quote
      
      let value = '';
      while (this.peek() && this.peek() !== '"') {
        if (this.peek() === '\\') {
          this.consume(); // consume backslash
          // Handle escape sequences
          if (this.peek()) {
            value += '\\' + this.consume();
          }
        } else {
          value += this.consume();
        }
      }
      
      if (this.peek() === '"') {
        this.consume(); // closing quote
      } else {
        throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`);
      }
      
      return {
        type: 'STRING',
        value,
        line: startLine,
        column: startColumn
      };
    }
  
    handleNumber() {
      const startLine = this.line;
      const startColumn = this.column;
      let value = '';
      let hasDecimal = false;
      
      while (this.peek() && (/\d/.test(this.peek()) || this.peek() === '.')) {
        if (this.peek() === '.') {
          if (hasDecimal) break; // only allow one decimal point
          hasDecimal = true;
        }
        value += this.consume();
      }
      
      // Check for unit specifiers
      if (/[a-zA-Z]/.test(this.peek())) {
        const unitStart = this.position;
        while (/[a-zA-Z]/.test(this.peek())) {
          value += this.consume();
        }
      }
      
      return {
        type: 'NUMBER',
        value,
        line: startLine,
        column: startColumn
      };
    }
  
    handleIdentifier() {
      const startLine = this.line;
      const startColumn = this.column;
      let value = this.consume(); // first character
      
      while (/[a-zA-Z0-9_]/.test(this.peek())) {
        value += this.consume();
      }
      
      // Check if it's a keyword
      const keywords = [
        'diagram', 'defs', 'point', 'line', 'rect', 'circle',
        'polygon', 'group', 'component', 'with', 'style',
        'fill', 'stroke', 'arrow', 'place', 'direction',
        'spacing', 'align', 'animate', 'duration', 'repeat',
        'on', 'click', 'hover', 'at', 'from', 'to'
      ];
      
      const type = keywords.includes(value) ? `KEYWORD_${value.toUpperCase()}` : 'IDENTIFIER';
      
      return {
        type,
        value,
        line: startLine,
        column: startColumn
      };
    }
  
    handlePossibleCoordinate() {
      const startLine = this.line;
      const startColumn = this.column;
      this.consume(); // (
      
      let value = '(';
      let x = '';
      let y = '';
      let state = 'x';
      
      while (this.peek() && this.peek() !== ')') {
        const char = this.peek();
        
        if (char === ',') {
          if (state === 'x') {
            state = 'y';
            value += this.consume();
            continue;
          } else {
            break; // invalid coordinate
          }
        }
        
        if (state === 'x') {
          x += this.consume();
        } else {
          y += this.consume();
        }
      }
      
      if (this.peek() === ')') {
        value += this.consume(); // )
      }
      
      // Validate coordinate format
      if (x.trim() && y.trim() && /^[\d.]+$/.test(x) && /^[\d.]+$/.test(y)) {
        return {
          type: 'COORDINATE',
          value: `(${x.trim()},${y.trim()})`,
          x: parseFloat(x),
          y: parseFloat(y),
          line: startLine,
          column: startColumn
        };
      }
      
      // If not a valid coordinate, return as parentheses
      return {
        type: 'PAREN_OPEN',
        value: '(',
        line: startLine,
        column: startColumn
      };
    }
  
    handlePunctuation() {
      const char = this.consume();
      const typeMap = {
        '{': 'BRACE_OPEN',
        '}': 'BRACE_CLOSE',
        '[': 'BRACKET_OPEN',
        ']': 'BRACKET_CLOSE',
        '(': 'PAREN_OPEN',
        ')': 'PAREN_CLOSE',
        ',': 'COMMA',
        '=': 'EQUALS',
        '+': 'PLUS',
        '-': 'MINUS',
        '*': 'STAR',
        '/': 'SLASH'
      };
      
      return {
        type: typeMap[char] || 'PUNCTUATION',
        value: char,
        line: this.line,
        column: this.column - 1
      };
    }

}
  
    