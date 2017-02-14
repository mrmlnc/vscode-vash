'use strict';

import {
	CompletionList,
	TextDocument,
	Position,
	CompletionItem,
	CompletionItemKind
} from 'vscode-languageserver';

import {
	HTMLDocument,
	getLanguageService,
	CompletionConfiguration
} from 'vscode-html-languageservice';

import { languageFacts, lookupFunctionParameters } from './helpers';

// Create the HTML language service
const languageService = getLanguageService();

function makeContextCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
	const caretPosition = document.offsetAt(position) - 1;

	const text = document.getText();
	const textBefore = text.slice(0, caretPosition);
	const textAfter = text.slice(caretPosition, text.length);

	const params = lookupFunctionParameters(textBefore, textAfter);
	const completionItems: CompletionItem[] = params.map((variable) => {
		return <CompletionItem>{
			label: variable,
			kind: CompletionItemKind.Variable
		};
	});

	// Create @html helper
	const htmlHelper: CompletionItem = {
		label: 'html',
		kind: CompletionItemKind.Variable,
		detail: 'Provides access to Helper System.'
	};

	return [htmlHelper].concat(completionItems);
}

function makeCompletionItems(): CompletionItem[] {
	return languageFacts.map((item) => {
		const completionItem: CompletionItem = {
			label: item.label,
			kind: CompletionItemKind.Method
		};

		Object.keys(item).forEach((key) => {
			completionItem[key] = item[key] || '';
		});

		return completionItem;
	});
}

export function provideCompletionItems(document: TextDocument, position: Position, options: CompletionConfiguration): CompletionList {
	const textDocument: string[] = document.getText().split('\n');

	const pos = document.positionAt(document.offsetAt(position));
	const line = textDocument[pos.line];
	const currentWord = line.slice(0, pos.character).trim();

	const completion: CompletionList = {
		isIncomplete: false,
		items: []
	};

	const wordLastSymbol = currentWord[currentWord.length - 1];
	if (['.', ':', '<', '"', '=', '/'].indexOf(wordLastSymbol) !== 0) {
		const htmlDocument: HTMLDocument = languageService.parseHTMLDocument(document);
		completion.items = languageService.doComplete(document, position, htmlDocument, options).items;
	}
	if (currentWord === '@html.') {
		completion.items = makeCompletionItems();
	}
	if (currentWord === '@') {
		completion.items = makeContextCompletionItems(document, position);
	}

	return completion;
}
