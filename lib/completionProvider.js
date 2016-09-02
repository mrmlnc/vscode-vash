'use strict';

const {
  Position,
  Range,
  CompletionItem,
  CompletionItemKind
} = require('vscode');

const vashHelpersList = require('./helpersList.json');
const { lookupFunctionParameters } = require('./helpers');

function makeContextCompletionItems(document, position) {
  const lastLine = document.lineAt(document.lineCount - 1);
  const textBefore = document.getText(new Range(0, 0, position.line, position.character - 1)).trim();
  const textAfter = document.getText(new Range(position.line, position.character, lastLine.lineNumber, lastLine.range.end.character)).trim();

  const params = lookupFunctionParameters(textBefore, textAfter);
  const completionItems = params.map((variable) => new CompletionItem(variable, CompletionItemKind.Variable));

  return [new CompletionItem('html', CompletionItemKind.Variable)].concat(completionItems);
}

function makeCompletionItems() {
  return vashHelpersList.map((item) => {
    const completionItem = new CompletionItem(item.label, CompletionItemKind.Method);

    Object.keys(item).forEach((key) => {
      completionItem[key] = item[key] || '';
    });

    return completionItem;
  });
}

class CompletionProvider {
  provideCompletionItems(document, position) {
    const start = new Position(position.line, 0);
    const range = new Range(start, position);
    const currentWord = document.getText(range).trim();

    let completion = [];
    if (currentWord === '@html.') {
      completion = makeCompletionItems(document, position);
    }

    if (currentWord === '@') {
      completion = makeContextCompletionItems(document, position);
    }

    return [].concat(completion);
  }
}

module.exports = CompletionProvider;
