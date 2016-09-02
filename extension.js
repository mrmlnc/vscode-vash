'use strict';

const { languages } = require('vscode');

const CompletionProvider = require('./lib/completionProvider');

function activate(context) {
  const completionItemProvider = new CompletionProvider();

  const completionProviderDisposable = languages
    .registerCompletionItemProvider('vash', completionItemProvider, '@', '.');

  context.subscriptions.push(completionProviderDisposable);
}

exports.activate = activate;
