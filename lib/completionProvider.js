'use strict';

const {
  Position,
  Range,
  CompletionItem,
  CompletionItemKind
} = require('vscode');

const vashHelpersList = require('./helpersList.json');

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

    return [].concat(completion);
  }
}

module.exports = CompletionProvider;
