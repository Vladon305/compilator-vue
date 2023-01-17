export default class TokenType {
  name: string;
  regex: string;

  constructor(name: string, regex: string) {
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  NUMBER: new TokenType("NUMBER", "[0-9]*"),
  STRINGSB: new TokenType("STRINGSB", "'"),
  VARIABLE: new TokenType("VARIABLE", "[A-Za-z]*"),
  COLON: new TokenType("COLON", ":"),
  COMMA: new TokenType("COMMA", ","),
  SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
  LCURLYBRACKET: new TokenType("LCURLYBRACKET", "\\{"),
  RCURLYBRACKET: new TokenType("RCURLYBRACKET", "\\}"),
  //==========================
  ASSIGN: new TokenType("ASSIGN", "="),
  LOG: new TokenType("LOG", "КОНСОЛЬ"),
  SEMICOLON: new TokenType("SEMICOLON", ";"),
  PLUS: new TokenType("PLUS", "\\+"),
  MINUS: new TokenType("MINUS", "\\-"),
  LPAR: new TokenType("LPAR", "\\("),
  RPAR: new TokenType("RPAR", "\\)"),
};
